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
import { MediaDto } from './interfaces/dto/mediaData.dto';
import { QueryDto } from './interfaces/dto/query.dto';
import { QueryValidationPipe } from './validators/qery.validation.pipe';
import { querySchema } from './validators/schemas/query.schema';
import { SearchResultDto } from './interfaces/dto/search-result.dto';
import { MediaOrderDto } from './interfaces/dto/media-order.dto';
import { TelegramBot } from 'src/bot/bot.service';

@Controller('advertisements')
export class AdvertisementsController {
  sequelize: any;
  constructor(
    private readonly advertisementsService: AdvertisementService,
    private readonly s3Service: S3Service,
    private readonly telegramBot: TelegramBot,
  ) {}

  @Get()
  public async findAll(
    @Query(new QueryValidationPipe(querySchema)) query: QueryDto,
  ): Promise<SearchResultDto> {
    return await this.advertisementsService.finAll(query);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<AdvertisementModel> {
    return await this.advertisementsService.findById(id);
  }

  // Create advertisement

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
    const { id } = await this.advertisementsService.createOne(body);
    const imageUrls = await this.s3Service.uploadMultipleFiles(files);
    const mediaData = [] as MediaDto[];
    imageUrls.map((imageUrl, index) => {
      mediaData.push({
        url: imageUrl,
        order: body.meta[index].order,
        main: body.meta[index].main,
      });
    });
    await this.advertisementsService.addFiles(mediaData, id);
    const advertisement = await this.advertisementsService.findById(id);
    const postsId =
      await this.telegramBot.sendAdvertisementToGroup(advertisement);
    await this.advertisementsService.createPosts(id, postsId);
    return advertisement;
  }

  // Upload one media

  @Post(':id/files')
  @UseInterceptors(FileInterceptor('file'))
  public async addOneFile(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\// })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<FileModel> {
    const { order } = JSON.parse(body.data);
    const advertisement = await this.advertisementsService.findById(id);
    if (advertisement) {
      const fileUrl = await this.s3Service.uploadFile(file);
      return await this.advertisementsService.addFile(
        fileUrl,
        id,
        order,
        false,
      );
    }
  }

  // Reorder media

  @Put('reorder')
  public async reorderMedia(@Body() body: MediaOrderDto[]): Promise<void> {
    await this.advertisementsService.reorderMedia(body);
  }

  // Update description

  @Put(':id')
  public async updateOne(
    @Param('id') id: string,
    @Body()
    body: AdvertisementDto,
  ): Promise<AdvertisementModel> {
    return await this.advertisementsService.updateOneById(id, body);
  }

  @Put(':advertisementId/files/:fileId')
  public async updateMainMedia(
    @Param('advertisementId') advertisementId: string,
    @Param('fileId', ParseIntPipe) newMainMediaId: number,
  ): Promise<void> {
    await this.advertisementsService.updateMainMedia(
      advertisementId,
      newMainMediaId,
    );
  }

  // Delete advertisement

  @Delete(':id')
  public async deleteOne(@Param('id') id: string) {
    const advertisement = await this.advertisementsService.findById(id);
    if (advertisement) {
      const { id: advertisementId, media, posts } = advertisement;
      const postsId = posts.map(({ post_id }) => post_id);
      await this.telegramBot.removePosts(postsId);
      const imagesUrl = media.map((image) => image.image_url);
      await this.s3Service.deleteMultipleFiles(imagesUrl);
      await this.advertisementsService.deleteById(advertisementId);
    }
  }

  // Delete one media

  @Delete(':advertisementId/files/:fileId')
  public async deleteOneFile(
    @Param('advertisementId') advertisementId: string,
    @Param('fileId', ParseIntPipe) fileId: number,
  ): Promise<void> {
    const advertisement =
      await this.advertisementsService.findById(advertisementId);
    if (advertisement) {
      const file = advertisement.media.find((image) => image.id === fileId);
      if (file) {
        await this.advertisementsService.deleteFile(fileId);
        await this.s3Service.deleteFile(file.image_url);
      }
    }
  }
}
