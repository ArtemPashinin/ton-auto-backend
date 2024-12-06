import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AdvertisementModel } from './models/advertisement.model';
import { AdvertisementService } from './advertisements.service';
import { AdvertisementValidationPipe } from './validators/advertisement.validation.pipe';
import { advertisementSchema } from './validators/schemas/advertisement.schema';
import { AdvertisementDto } from './interfaces/dto/advertisement.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';
import { FileModel } from './models/image.model';

@Controller('advertisements')
export class AdvertisementsController {
  sequelize: any;
  constructor(
    private readonly advertisementsService: AdvertisementService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  public async findAll(): Promise<AdvertisementModel[]> {
    return await this.advertisementsService.finAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<AdvertisementModel> {
    return await this.advertisementsService.findById(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  public async createOne(
    @Body(new AdvertisementValidationPipe(advertisementSchema))
    body: AdvertisementDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\// })],
        fileIsRequired: true,
      }),
    )
    files: Express.Multer.File[],
  ): Promise<AdvertisementModel> {
    const advertisement = await this.advertisementsService.createOne(body);
    const imageUrls = await this.s3Service.uploadMultipleFiles(files);
    await this.advertisementsService.addFiles(imageUrls, advertisement.id);
    return advertisement;
  }

  @Post(':id/files')
  @UseInterceptors(FileInterceptor('file'))
  public async addOneFile(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\// })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<FileModel> {
    const advertisement = await this.advertisementsService.findById(id);
    if (advertisement) {
      const fileUrl = await this.s3Service.uploadFile(file);
      return await this.advertisementsService.addFile(fileUrl, id);
    }
  }

  @Put(':id')
  public async updateOne(
    @Param('id') id: string,
    @Body(new AdvertisementValidationPipe(advertisementSchema))
    body: AdvertisementDto,
  ): Promise<AdvertisementModel> {
    return await this.advertisementsService.updateOneById(id, body);
  }

  @Delete(':id')
  public async deleteOne(@Param('id') id: string) {
    const advertisement = await this.advertisementsService.findById(id);
    if (advertisement) {
      const { id: advertisementId, images } = advertisement;
      const imagesUrl = images.map((image) => image.image_url);
      await this.s3Service.deleteMultipleFiles(imagesUrl);
      await this.advertisementsService.deleteById(advertisementId);
    }
  }

  @Delete(':advertisementId/files/:fileId')
  public async deleteOneFile(
    @Param('advertisementId') advertisementId: string,
    @Param('fileId', ParseIntPipe) fileId: number,
  ): Promise<void> {
    const advertisement =
      await this.advertisementsService.findById(advertisementId);
    if (advertisement) {
      const file = advertisement.images.find((image) => image.id === fileId);
      if (file) await this.advertisementsService.deleteFile(fileId);
    }
  }
}
