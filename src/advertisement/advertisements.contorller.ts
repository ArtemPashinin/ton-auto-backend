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
  Query,
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
import { ConditionModel } from '../vehicle/models/condition.model';
import { MediaDto } from './interfaces/dto/mediaData.dto';
import { QueryDto } from './interfaces/dto/query.dto';
import { QueryValidationPipe } from './validators/qery.validation.pipe';
import { querySchema } from './validators/schemas/query.schema';

@Controller('advertisements')
export class AdvertisementsController {
  sequelize: any;
  constructor(
    private readonly advertisementsService: AdvertisementService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  public async findAll(
    @Query(new QueryValidationPipe(querySchema)) query: QueryDto,
  ): Promise<AdvertisementModel[]> {
    console.log(query);
    return await this.advertisementsService.finAll(query);
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
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
  ): Promise<AdvertisementModel> {
    //
    console.log(body);
    const advertisement = await this.advertisementsService.createOne(body);
    const imageUrls = await this.s3Service.uploadMultipleFiles(files);
    const mediaData = [] as MediaDto[];
    imageUrls.map((imageUrl, index) => {
      mediaData.push({
        url: imageUrl,
        order: body.meta[index].order,
        main: body.meta[index].main,
      });
    });
    await this.advertisementsService.addFiles(mediaData, advertisement.id);
    return advertisement;
  }

  // @Post(':id/files')
  // @UseInterceptors(FileInterceptor('file'))
  // public async addOneFile(
  //   @Param('id') id: string,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new FileTypeValidator({ fileType: /^image\// })],
  //       fileIsRequired: true,
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ): Promise<FileModel> {
  //   const advertisement = await this.advertisementsService.findById(id);
  //   if (advertisement) {
  //     const fileUrl = await this.s3Service.uploadFile(file);
  //     return await this.advertisementsService.addFile(fileUrl, id);
  //   }
  // }

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
      const { id: advertisementId, media } = advertisement;
      const imagesUrl = media.map((image) => image.image_url);
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
      const file = advertisement.media.find((image) => image.id === fileId);
      if (file) await this.advertisementsService.deleteFile(fileId);
    }
  }
}
