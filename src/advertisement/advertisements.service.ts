import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AdvertisementModel } from './models/advertisement.model';
import { AdvertisementDto } from './interfaces/dto/advertisement.dto';
import { v4 as uuid } from 'uuid';
import { FileModel } from './models/image.model';
import { UserModel } from 'src/user/models/user.model';
import { ConditionModel } from '../vehicle/models/condition.model';
import { EngineModel } from 'src/vehicle/models/engine.model';
import { ColorModel } from 'src/vehicle/models/color.model';
import { MakeModel } from 'src/vehicle/models/make.model';
import { CarModel } from 'src/vehicle/models/car-model.model';
import { CountryModel } from 'src/user/models/country.model';
import { CityModel } from 'src/user/models/city.model';
import { MediaDto } from './interfaces/dto/mediaData.dto';
import { QueryDto } from './interfaces/dto/query.dto';
import { Op } from 'sequelize';
import { SearchResultDto } from './interfaces/dto/search-result.dto';
import { MediaOrderDto } from './interfaces/dto/media-order.dto';
import { PostAdvertisementModel } from './models/post-advertisement.model';

@Injectable()
export class AdvertisementService {
  private readonly limit: number = 10;

  constructor(
    @InjectModel(AdvertisementModel)
    private readonly advertisementModel: typeof AdvertisementModel,
    @InjectModel(FileModel)
    private readonly fileModel: typeof FileModel,
    @InjectModel(PostAdvertisementModel)
    private readonly postAdvertisementModel: typeof PostAdvertisementModel,
  ) {}

  public async finAll(query: QueryDto): Promise<SearchResultDto> {
    const count = await this.advertisementModel.count({
      distinct: true,
      col: 'id',
      include: [
        {
          model: UserModel,
          as: 'user',
          required: true,
          where: query.owned ? { id: query.userId } : {},
          include: [
            {
              model: CityModel,
              as: 'city',
              required: true,
              where: query.city ? { id: query.city } : {},
              include: [
                {
                  model: CountryModel,
                  as: 'country',
                  required: true,
                  where: query.country ? { id: query.country } : {},
                },
              ],
              attributes: { exclude: ['country_id'] },
            },
          ],
          attributes: {
            exclude: ['city_id'],
          },
        },
        {
          model: FileModel,
          as: 'media',
          required: false,
          order: ['order', 'ASC'],
        },
        {
          model: UserModel,
          as: 'favoritedBy',
          required: query.favorites,
          where: query.userId ? { id: query.userId } : {},
        },
        {
          model: EngineModel,
          as: 'engine',
          required: true,
          where: query.engine ? { id: query.engine } : {},
        },
        {
          model: ColorModel,
          as: 'color',
          required: true,
          where: query.color ? { id: query.color } : {},
        },
        {
          model: CarModel,
          as: 'model',
          required: true,
          where: {
            ...(query.model ? { id: query.model } : {}),
            ...(query.type ? { type: query.type } : {}),
          },
          include: [
            {
              model: MakeModel,
              as: 'make',
              required: true,
              where: query.make ? { id: query.make } : {},
            },
          ],
          attributes: { exclude: ['make_id'] },
        },
        {
          model: ConditionModel,
          as: 'condition',
          required: true,
          where: query.condition ? { id: query.condition } : {},
        },
      ],
      where: {
        ...(query.commercial ? { commercial: query.commercial } : {}),
        ...(query.yearFrom && query.yearTo
          ? {
              year: {
                [Op.between]: [query.yearFrom, query.yearTo],
              },
            }
          : query.yearFrom
            ? {
                year: {
                  [Op.gte]: query.yearFrom,
                },
              }
            : query.yearTo
              ? {
                  year: {
                    [Op.lte]: query.yearTo,
                  },
                }
              : {}),
        ...(query.mileageFrom && query.mileageTo
          ? {
              mileage: {
                [Op.between]: [query.mileageFrom, query.mileageTo],
              },
            }
          : query.mileageFrom
            ? {
                mileage: {
                  [Op.gte]: query.mileageFrom,
                },
              }
            : query.mileageTo
              ? {
                  mileage: {
                    [Op.lte]: query.mileageTo,
                  },
                }
              : {}),
      },
    });
    const advertisements = await this.advertisementModel.findAll({
      include: [
        {
          model: UserModel,
          as: 'user',
          required: true,
          where: query.owned ? { id: query.userId } : {},
          include: [
            {
              model: CityModel,
              as: 'city',
              required: true,
              where: query.city ? { id: query.city } : {},
              include: [
                {
                  model: CountryModel,
                  as: 'country',
                  required: true,
                  where: query.country ? { id: query.country } : {},
                },
              ],
              attributes: { exclude: ['country_id'] },
            },
          ],
          attributes: {
            exclude: ['city_id'],
          },
        },
        {
          model: FileModel,
          as: 'media',
          required: true,
          order: [['order', 'ASC']],
        },
        {
          model: UserModel,
          as: 'favoritedBy',
          required: query.favorites,
          where: query.userId ? { id: query.userId } : {},
        },
        {
          model: EngineModel,
          as: 'engine',
          required: true,
          where: query.engine ? { id: query.engine } : {},
        },
        {
          model: ColorModel,
          as: 'color',
          required: true,
          where: query.color ? { id: query.color } : {},
        },
        {
          model: CarModel,
          as: 'model',
          required: true,
          where: {
            ...(query.model ? { id: query.model } : {}),
            ...(query.type ? { type: query.type } : {}),
          },
          include: [
            {
              model: MakeModel,
              as: 'make',
              required: true,
              where: query.make ? { id: query.make } : {},
            },
          ],
          attributes: { exclude: ['make_id'] },
        },
        {
          model: ConditionModel,
          as: 'condition',
          required: true,
          where: query.condition ? { id: query.condition } : {},
        },
      ],
      where: {
        ...(query.commercial ? { commercial: query.commercial } : {}),
        ...(query.yearFrom && query.yearTo
          ? {
              year: {
                [Op.between]: [query.yearFrom, query.yearTo],
              },
            }
          : query.yearFrom
            ? {
                year: {
                  [Op.gte]: query.yearFrom,
                },
              }
            : query.yearTo
              ? {
                  year: {
                    [Op.lte]: query.yearTo,
                  },
                }
              : {}),
        ...(query.mileageFrom && query.mileageTo
          ? {
              mileage: {
                [Op.between]: [query.mileageFrom, query.mileageTo],
              },
            }
          : query.mileageFrom
            ? {
                mileage: {
                  [Op.gte]: query.mileageFrom,
                },
              }
            : query.mileageTo
              ? {
                  mileage: {
                    [Op.lte]: query.mileageTo,
                  },
                }
              : {}),
      },
      attributes: {
        exclude: [
          'user_id',
          'engine_id',
          'color_id',
          'make_id',
          'model_id',
          'condition_id',
        ],
      },
      order: [['createdAt', 'DESC']],
      limit: this.limit,
      offset: this.limit * (query.page - 1),
    });
    return { advertisements: advertisements, count: count };
  }

  public async findById(id: string): Promise<AdvertisementModel> {
    return (
      await this.advertisementModel.findByPk(id, {
        include: [
          { model: PostAdvertisementModel, as: 'posts', required: false },
          {
            model: UserModel,
            as: 'user',
            required: true,

            include: [
              {
                model: CityModel,
                as: 'city',
                required: true,

                include: [
                  {
                    model: CountryModel,
                    as: 'country',
                    required: true,
                  },
                ],
                attributes: { exclude: ['country_id'] },
              },
            ],
            attributes: {
              exclude: ['city_id'],
            },
          },
          {
            model: FileModel,
            as: 'media',
            required: true,
            order: [['order', 'ASC']],
          },
          {
            model: EngineModel,
            as: 'engine',
            required: true,
          },
          {
            model: ColorModel,
            as: 'color',
            required: true,
          },
          {
            model: CarModel,
            as: 'model',
            required: true,
            include: [
              {
                model: MakeModel,
                as: 'make',
                required: true,
              },
            ],
            attributes: { exclude: ['make_id'] },
          },
          {
            model: ConditionModel,
            as: 'condition',
            required: true,
          },
        ],
      })
    ).get({ plain: true });
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
    order: number,
    main: boolean,
  ): Promise<FileModel> {
    return await this.fileModel.create({
      image_url: imageUrl,
      advertisement_id: advertisementId,
      order: order,
      main: main,
    });
  }

  public async deleteFile(fileId: number): Promise<void> {
    await this.fileModel.destroy({ where: { id: fileId } });
  }
  public async updateMainMedia(
    advertisementId: string,
    newMainMediaId: number,
  ): Promise<void> {
    const transaction = await this.fileModel.sequelize.transaction();

    await this.fileModel.update(
      { main: false },
      { where: { advertisement_id: advertisementId }, transaction },
    );

    const [numberOfAffectedRows] = await this.fileModel.update(
      { main: true },
      { where: { id: newMainMediaId }, transaction },
    );

    await transaction.commit();
  }

  public async addFiles(
    mediaData: MediaDto[],
    advertisementId: string,
  ): Promise<FileModel[]> {
    return await Promise.all(
      mediaData.map(({ url, order, main }) =>
        this.addFile(url, advertisementId, order, main),
      ),
    );
  }

  public async reorderMedia(orderData: MediaOrderDto[]): Promise<void> {
    const transaction = await this.fileModel.sequelize.transaction();

    try {
      await Promise.all(
        orderData.map(({ mediaId, order }) =>
          this.fileModel.update(
            { order },
            { where: { id: mediaId }, transaction },
          ),
        ),
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new Error('Failed to reorder media: ' + error.message);
    }
  }

  public async createPosts(
    advertisementId: string,
    postsId: number[],
  ): Promise<void> {
    const postsData = postsId.map((postId) => ({
      post_id: postId,
      advertisement_id: advertisementId,
    }));
    await this.postAdvertisementModel.bulkCreate(postsData);
  }
}
