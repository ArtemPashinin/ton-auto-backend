import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { UserDto } from './interfaces/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  public async findOneById(id: number): Promise<UserModel> {
    return await this.userModel.findByPk(id);
  }

  public async findOneByTgId(tgId: number) {}

  public async createOne(userDto: UserDto): Promise<UserModel> {
    return await this.userModel.create(userDto);
  }
}
