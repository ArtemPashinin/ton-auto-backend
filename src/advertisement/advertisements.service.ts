import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AdvertisementModel } from './models/advertisement.model';
import { AdvertisementDto } from './interfaces/dto/advertisement.dto';
import { v4 as uuid } from 'uuid';
import { FileModel } from './models/image.model';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectModel(AdvertisementModel)
    private readonly advertisementModel: typeof AdvertisementModel,
    @InjectModel(FileModel)
    private readonly fileModel: typeof FileModel,
  ) {}

  public async finAll(): Promise<AdvertisementModel[]> {
    return await this.advertisementModel.findAll();
  }

  public async findById(id: string): Promise<AdvertisementModel> {
    return await this.advertisementModel.findByPk(id, {
      include: [{ model: FileModel, as: 'images', required: false }],
    });
  }

  public async deleteById(advertisementId: string): Promise<void> {
    await this.advertisementModel.destroy({ where: { id: advertisementId } });
  }

  public async createOne(
    advertisement: AdvertisementDto,
  ): Promise<AdvertisementModel> {
    const id = uuid();
    return await this.advertisementModel.create({
      id: id,
      ...advertisement,
    });
  }

  public async updateOneById(
    advertisementId: string,
    advertisement: AdvertisementDto,
  ): Promise<AdvertisementModel> {
    await this.advertisementModel.update(advertisement, {
      where: { id: advertisementId },
    });
    return await this.findById(advertisementId);
  }

  public async addFile(
    imageUrl: string,
    advertisementId: string,
  ): Promise<FileModel> {
    return await this.fileModel.create({
      image_url: imageUrl,
      advertisement_id: advertisementId,
    });
  }

  public async deleteFile(fileId: number): Promise<void> {
    await this.fileModel.destroy({ where: { id: fileId } });
  }

  public async addFiles(
    imageUrls: string[],
    advertisementId: string,
  ): Promise<FileModel[]> {
    return await Promise.all(
      imageUrls.map((imageUrl) => this.addFile(imageUrl, advertisementId)),
    );
  }
}
