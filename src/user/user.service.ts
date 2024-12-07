import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { UserDto } from './interfaces/dto/user.dto';
import { FavoriteModel } from './models/favorite.model';
import { FavoriteDto } from './interfaces/dto/favorite.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    @InjectModel(FavoriteModel)
    private readonly favoriteModel: typeof FavoriteModel,
  ) {}

  public async findOneById(id: number): Promise<UserModel> {
    return await this.userModel.findByPk(id);
  }

  public async findOneByTgId(tgId: number) {
    return await this.userModel.findOne({ where: { user_id: tgId } });
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
}
