import { Op } from 'sequelize';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindtUserDto } from './interfaces/dto/find-user.dto';
import { UserDto } from './interfaces/dto/user.dto';
import { CityModel } from './models/city.model';
import { CountryModel } from './models/country.model';
import { FavoriteModel } from './models/favorite.model';
import { UserModel } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    @InjectModel(CountryModel)
    private readonly countryModel: typeof CountryModel,
    @InjectModel(CityModel) private readonly cityModel: typeof CityModel,
    @InjectModel(FavoriteModel)
    private readonly favoriteModel: typeof FavoriteModel,
    @InjectModel(AdvertisementModel)
    private readonly advertisementModel: typeof AdvertisementModel,
  ) {}

  public async findOneById(id: number): Promise<UserModel> {
    return await this.userModel.findByPk(id, {
      include: [
        {
          model: AdvertisementModel,
          as: 'favoriteAdvertisements',
          required: false,
        },
        {
          model: CityModel,
          as: 'city',
          required: true,
        },
      ],
    });
  }

  public async findOne(userId: FindtUserDto) {
    return await this.userModel.findOne({
      where: {
        [Op.or]: [
          userId.id ? { id: userId.id } : {},
          userId.tgId ? { user_id: userId.tgId } : {},
        ],
      },

      include: [
        {
          model: AdvertisementModel,
          as: 'favoriteAdvertisements',
          required: false,
        },
        {
          model: CityModel,
          as: 'city',
          required: true,
          include: [{ model: CountryModel, as: 'country', required: true }],
        },
      ],
    });
  }

  public async createOne(userDto: UserDto): Promise<UserModel> {
    const [user, created] = await this.userModel.findOrCreate({
      where: { user_id: userDto.user_id }, // Условие поиска
      defaults: userDto,
      include: [
        {
          model: AdvertisementModel,
          as: 'favoriteAdvertisements',
          required: false,
        },
        {
          model: CityModel,
          as: 'city',
          required: true,
          include: [{ model: CountryModel, as: 'country', required: true }],
        },
      ],
    });

    if (!created) {
      await user.update(userDto);
    }

    return await this.userModel.findByPk(user.id, {
      include: [
        {
          model: AdvertisementModel,
          as: 'favoriteAdvertisements',
          required: false,
        },
        {
          model: CityModel,
          as: 'city',
          required: true,
          include: [{ model: CountryModel, as: 'country', required: true }],
        },
      ],
    });
  }

  public async findAllCountries(): Promise<CountryModel[]> {
    return await this.countryModel.findAll({ order: [['title', 'ASC']] });
  }

  public async findCities(countryId: number): Promise<CityModel[]> {
    return await this.cityModel.findAll({
      where: { country_id: countryId },
      order: [['title', 'ASC']],
    });
  }

  public async createFavorite(
    userId: number,
    advertisementId: string,
  ): Promise<FavoriteModel> {
    return await this.favoriteModel.create({
      user_id: userId,
      advertisement_id: advertisementId,
    });
  }

  public async removeFavorite(
    userId: number,
    advertisementId: string,
  ): Promise<void> {
    await this.favoriteModel.destroy({
      where: { user_id: userId, advertisement_id: advertisementId },
    });
  }

  public async updateOne(
    userId: FindtUserDto,
    data: UserDto,
  ): Promise<UserModel> {
    await this.userModel.update(data, {
      where: {
        [Op.or]: [
          userId.id ? { id: userId.id } : {},
          userId.tgId ? { user_id: userId.tgId } : {},
        ],
      },
    });
    return await this.findOne(userId);
  }
}