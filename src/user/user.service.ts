import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { UserDto } from './interfaces/dto/user.dto';
import { FavoriteModel } from './models/favorite.model';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';
import { FindtUserDto } from './interfaces/dto/find-user.dto';
import { Op } from 'sequelize';
import { CountryModel } from './models/country.model';
import { CityModel } from './models/city.model';

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

  public async createOne(userDto: UserDto): Promise<boolean> {
    const existsUser = await this.findOne({ tgId: userDto.user_id });
    if (!existsUser) {
      await this.userModel.create(userDto);
      return true;
    }
    return false;
  }

  public async findAllCountries(): Promise<CountryModel[]> {
    return await this.countryModel.findAll();
  }

  public async findCities(countryId: number): Promise<CityModel[]> {
    return await this.cityModel.findAll({ where: { country_id: countryId } });
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

  public async removeFavorite() {}
}
