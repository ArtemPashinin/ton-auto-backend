import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { UserDto } from './interfaces/dto/user.dto';
import { FavoriteModel } from './models/favorite.model';
import { FavoriteDto } from './interfaces/dto/favorite.dto';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';
import { FindtUserDto } from './interfaces/dto/find-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
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
      ],
    });
  }

  public async createOne(userDto: UserDto): Promise<UserModel> {
    return await this.userModel.create(userDto);
  }

  public async createFavorite(favorite: FavoriteDto): Promise<FavoriteModel> {
    return await this.favoriteModel.create({
      user_id: favorite.userId,
      advertisement_id: favorite.advertisementId,
    });
  }

  public async removeFavorite() {}
}
