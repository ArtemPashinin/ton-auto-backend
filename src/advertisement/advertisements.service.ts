import { col, fn, Op, where } from 'sequelize';
import { CityModel } from 'src/user/models/city.model';
import { CountryModel } from 'src/user/models/country.model';
import { FavoriteModel } from 'src/user/models/favorite.model';
import { UserModel } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';
import { CarModel } from 'src/vehicle/models/car-model.model';
import { ColorModel } from 'src/vehicle/models/color.model';
import { EngineModel } from 'src/vehicle/models/engine.model';
import { MakeModel } from 'src/vehicle/models/make.model';
import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AdvertisementDto } from './interfaces/dto/advertisement.dto';
import { MediaOrderDto } from './interfaces/dto/media-order.dto';
import { MediaDto } from './interfaces/dto/mediaData.dto';
import { QueryDto } from './interfaces/dto/query.dto';
import { SearchResultDto } from './interfaces/dto/search-result.dto';
import { StatisticResponse } from './interfaces/statistic-response.interface';
import { AdvertisementModel } from './models/advertisement.model';
import { FileModel } from './models/image.model';
import { PostAdvertisementModel } from './models/post-advertisement.model';
import { ConditionModel } from '../vehicle/models/condition.model';

@Injectable()
export class AdvertisementService {
  private readonly limit: number = 10;

  constructor(
    private readonly userService: UserService,
    @InjectModel(AdvertisementModel)
    private readonly advertisementModel: typeof AdvertisementModel,
    @InjectModel(FileModel)
    private readonly fileModel: typeof FileModel,
    @InjectModel(PostAdvertisementModel)
    private readonly postAdvertisementModel: typeof PostAdvertisementModel,
    @InjectModel(CountryModel)
    private readonly countryModel: typeof CountryModel,
  ) {}

  public async findAll(query: QueryDto): Promise<SearchResultDto> {
    let fromAdminAdvertisements = [];
    let fromAdminCount = 0;
    const fictCountryCondition = query.owned
      ? {
          [Op.or]: [
            { fict_country_id: null },
            { fict_country_id: { [Op.ne]: null } },
          ],
        } // Включает все значения
      : { fict_country_id: null }; // Только null

    const fictCityCondition = query.owned
      ? {
          [Op.or]: [
            { fict_city_id: null },
            { fict_city_id: { [Op.ne]: null } },
          ],
        } // Включает все значения
      : { fict_city_id: null }; // Только null

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
          required: true,
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
        ...fictCountryCondition,
        ...fictCityCondition,
        paid: query.owned ? { [Op.or]: [true, false] } : true,
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

    if (!query.owned)
      fromAdminCount = await this.advertisementModel.count({
        distinct: true,
        col: 'id',
        include: [
          {
            model: CityModel,
            as: 'fict_city',
            required: true,
            where: query.city ? { id: query.city } : {},
            attributes: { exclude: ['country_id'] },
          },
          {
            model: CountryModel,
            as: 'fict_country',
            required: true,
            where: query.country ? { id: query.country } : {},
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
          paid: query.owned ? { [Op.or]: [true, false] } : true,
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
          model: CityModel,
          as: 'fict_city',
          required: true,
          where: query.city ? { id: query.city } : {},
          attributes: { exclude: ['country_id'] },
        },
        {
          model: CountryModel,
          as: 'fict_country',
          required: true,
          where: query.country ? { id: query.country } : {},
        },
        {
          model: UserModel,
          as: 'user',
          required: true,
          where: query.owned ? { id: query.userId } : {},
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
        ...fictCountryCondition,
        ...fictCityCondition,
        paid: query.owned === true ? { [Op.or]: [true, false] } : true,

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
      order: query.favorites
        ? [
            [
              { model: UserModel, as: 'favoritedBy' },
              FavoriteModel,
              'createdAt',
              'DESC',
            ],
          ] // Сортировка по дате в промежуточной таблице
        : [['createdAt', 'DESC']],
      limit: this.limit,
      offset: this.limit * (query.page - 1),
    });

    if (!query.owned)
      fromAdminAdvertisements = await this.advertisementModel.findAll({
        include: [
          {
            model: CityModel,
            as: 'fict_city',
            required: true,
            where: query.city ? { id: query.city } : {},
            attributes: { exclude: ['country_id'] },
          },
          {
            model: CountryModel,
            as: 'fict_country',
            required: true,
            where: query.country ? { id: query.country } : {},
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
          paid: query.owned === true ? { [Op.or]: [true, false] } : true,

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
        order: query.favorites
          ? [
              [
                { model: UserModel, as: 'favoritedBy' },
                FavoriteModel,
                'createdAt',
                'DESC',
              ],
            ] // Сортировка по дате в промежуточной таблице
          : [['createdAt', 'DESC']],
        limit: this.limit,
        offset: this.limit * (query.page - 1),
      });

    const allAdvertisements = [
      ...fromAdminAdvertisements,
      ...advertisements.filter(
        (ad) =>
          !fromAdminAdvertisements.some((adminAd) => adminAd.id === ad.id),
      ),
    ];

    allAdvertisements.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Итоговое количество: только объявления для обычных пользователей
    const totalCount = count + fromAdminCount;

    return {
      advertisements: allAdvertisements,
      count: totalCount,
    };
  }

  public async findById(id: string): Promise<AdvertisementModel> {
    return await this.advertisementModel.findByPk(id, {
      include: [
        {
          model: CityModel,
          as: 'fict_city',
          required: false,
          attributes: { exclude: ['country_id'] },
        },
        {
          model: CountryModel,
          as: 'fict_country',
          required: false,
        },
        { model: PostAdvertisementModel, as: 'posts', required: false },
        {
          model: UserModel,
          as: 'user',
          required: true,
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
          required: false,
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
    });
  }

  public async deleteById(advertisementId: string): Promise<void> {
    await this.advertisementModel.destroy({ where: { id: advertisementId } });
  }

  public async createOne(
    advertisement: AdvertisementDto,
  ): Promise<AdvertisementModel> {
    const user = await this.userService.findOneById(advertisement.user_id);
    let paid = user.admin ? true : user.free_publish;

    if (user.free_publish) {
      await this.userService.updateOne(
        { id: advertisement.user_id },
        { free_publish: false },
      );
    }

    const createdAdvertisement = await this.advertisementModel.create({
      id: uuid(), // Генерируем уникальный идентификатор
      paid: paid, // Устанавливаем статус оплаты
      ...advertisement, // Остальные данные из DTO
      fict_city_id: user.city_id,
      fict_country_id: user.city.country_id,
    });

    return createdAdvertisement;
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

  public async setPaid(advertisementId: string): Promise<AdvertisementModel> {
    await this.advertisementModel.update(
      { paid: true },
      {
        where: { id: advertisementId },
      },
    );
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

  public async statistic(): Promise<StatisticResponse> {
    const result: { [key: string]: { [key: string]: string } } = {};
    const withoutAdminResult: { [key: string]: { [key: string]: string } } = {};

    const countries = await this.countryModel.findAll({
      include: [{ model: CityModel, as: 'cities', required: true }],
    });

    const totalAds = await this.advertisementModel.findAll({
      include: [
        {
          model: UserModel,
          as: 'user',
          required: true,
          where: { admin: false },
        },
        { model: CountryModel, as: 'fict_country', required: true },
        { model: CityModel, as: 'fict_city', required: true },
      ],
      attributes: ['id'],
    });

    const totalAdsFromAdmin = await this.advertisementModel.findAll({
      include: [
        {
          model: UserModel,
          as: 'user',
          required: true,
          where: { admin: true },
          attributes: [],
        },
        { model: CountryModel, as: 'fict_country', required: true },
        { model: CityModel, as: 'fict_city', required: true },
      ],
      attributes: ['id'],
    });
    countries.forEach((country) => {
      const count = totalAds.filter(
        (ad) => ad.fict_country.title === country.title,
      ).length;
      const fromAdmin = totalAdsFromAdmin.filter(
        (ad) => ad.fict_country.title === country.title,
      ).length;
      result[`🔸${country.title}`] = {
        Всего: `${count + fromAdmin}`,
      };
      country.cities.forEach((city) => {
        const count = totalAds.filter(
          (ad) => ad.fict_city.title === city.title,
        ).length;
        const fromAdmin = totalAdsFromAdmin.filter(
          (ad) => ad.fict_city.title === city.title,
        ).length;
        if (count > 0 || fromAdmin > 0)
          result[`🔸${country.title}`][city.title] = `${count + fromAdmin}`;
      });
    });
    //without admin
    countries.forEach((country) => {
      const count = totalAds.filter(
        (ad) => ad.fict_country.title === country.title,
      ).length;
      withoutAdminResult[`🔸${country.title}`] = {
        Всего: `${count}`,
      };
      country.cities.forEach((city) => {
        const count = totalAds.filter(
          (ad) => ad.fict_city.title === city.title,
        ).length;
        if (count > 0)
          withoutAdminResult[`🔸${country.title}`][city.title] = `${count}`;
      });
    });
    return {
      totalCount: totalAds.length + totalAdsFromAdmin.length,
      totalWithoutAdmin: totalAds.length,
      result: JSON.stringify(result, null, 2),
      resultWithoutAdmin: JSON.stringify(withoutAdminResult, null, 2),
    };
  }

  public async anotherStats() {
    const totalCount = await this.advertisementModel.count();
    try {
      // Загрузка стран с городами для агрегации
      const countries = await this.countryModel.findAll({
        include: [{ model: CityModel, as: 'cities', required: true }],
      });

      // Подсчёт количества объявлений с учётом стран и городов, агрегация на уровне SQL
      const adCounts = await this.advertisementModel.findAll({
        attributes: [
          [fn('COUNT', col('AdvertisementModel.id')), 'count'],
          'user.city.country.title', // Название страны
          'user.city.title', // Название города
        ],
        include: [
          {
            model: UserModel,
            as: 'user',
            required: true,
            where: { admin: false },
            include: [
              {
                model: CityModel,
                as: 'city',
                required: true,
                include: [
                  { model: CountryModel, as: 'country', required: true },
                ],
              },
            ],
          },
        ],
        where: { fict_country_id: null, fict_city_id: null },
        group: ['user.city.country.title', 'user.city.title'], // Группировка по странам и городам
        raw: true, // Вернёт результат в виде обычного объекта, а не экземпляров моделей
      });

      // Подсчёт количества объявлений от администраторов
      const adminAdCounts = await this.advertisementModel.findAll({
        attributes: [
          [fn('COUNT', col('AdvertisementModel.id')), 'count'],
          'fict_country.title', // Название страны
          'fict_city.title', // Название города
        ],
        include: [
          {
            model: UserModel,
            as: 'user',
            required: true,
            where: { admin: true },
            attributes: [],
          },
          { model: CountryModel, as: 'fict_country', required: true },
          { model: CityModel, as: 'fict_city', required: true },
        ],
        group: ['fict_country.title', 'fict_city.title'], // Группировка по фейковым странам и городам
        raw: true,
      });

      // Формирование итоговых данных
      const countryAdCounts: { [key: string]: number } = {};

      adCounts.forEach((ad) => {
        const country = ad['user.city.country.title'];
        const city = ad['user.city.title'];
        const count = ad['count'];

        if (!countryAdCounts[country]) {
          countryAdCounts[country] = 0;
        }
        countryAdCounts[country] += count;

        console.log(`${country}: ${countryAdCounts[country]}`);
        console.log(`   ${city}: ${count}`);
      });

      // Подсчёт административных объявлений
      adminAdCounts.forEach((ad) => {
        const country = ad['fict_country.title'];
        const city = ad['fict_city.title'];
        const count = ad['count'];

        if (!countryAdCounts[country]) {
          countryAdCounts[country] = 0;
        }
        countryAdCounts[country] += count;

        console.log(`${country} (Admin): ${countryAdCounts[country]}`);
        console.log(`   ${city} (Admin): ${count}`);
      });

      // Подсчёт только для пользовательских объявлений (без администраторов)
      console.log('Пользовательские:');
      countries.forEach((country) => {
        const countByCountry = adCounts
          .filter((ad) => ad['user.city.country.title'] === country.title)
          .reduce((acc, ad) => acc + ad['count'], 0);

        console.log(`${country.title}: ${countByCountry}`);

        // Подсчёт по городам
        country.cities.forEach((city) => {
          const countByCity = adCounts
            .filter((ad) => ad['user.city.title'] === city.title)
            .reduce((acc, ad) => acc + ad['count'], 0);

          if (countByCity > 0) {
            console.log(`   ${city.title}: ${countByCity}`);
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  }
}