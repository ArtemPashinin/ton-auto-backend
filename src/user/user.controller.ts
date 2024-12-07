import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './interfaces/dto/user.dto';
import { UserValidationPipe } from './validators/user.validation.pipe';
import { userSchema } from './validators/schemas/user.schema';
import { UserModel } from './models/user.model';
import { UserExceptionFilter } from './user.exception.filter';
import { FavoriteDto } from './interfaces/dto/favorite.dto';
import { favoriteSchema } from './validators/schemas/favortie.schema';
import { AdvertisementService } from 'src/advertisement/advertisements.service';
import { FavoriteModel } from './models/favorite.model';
import { FindtUserDto } from './interfaces/dto/find-user.dto';
import { findUserSchema } from './validators/schemas/find-user.schema';

@Controller('user')
@UseFilters(UserExceptionFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly advertisementService: AdvertisementService,
  ) {}

  @Get()
  public async findOneByTgId(
    @Query(new UserValidationPipe(findUserSchema)) userId: FindtUserDto,
  ) {
    return await this.userService.findOne(userId);
  }

  @Post('favorite')
  public async addFavorite(
    @Body(new UserValidationPipe(favoriteSchema)) body: FavoriteDto,
  ): Promise<FavoriteModel> {
    const user = await this.userService.findOne(body.userId);
    const advertisement = await this.advertisementService.findById(
      body.advertisementId,
    );
    if (user && advertisement) {
      const favoriteAdvertisement = user.favoriteAdvertisements.find(
        (favoriteAdvertisement) =>
          favoriteAdvertisement.id === body.advertisementId,
      );
      if (!favoriteAdvertisement) {
        return await this.userService.createFavorite(
          user.id,
          body.advertisementId,
        );
      }
    }
  }

  @Post()
  public async createOne(
    @Body(new UserValidationPipe(userSchema)) body: UserDto,
  ): Promise<UserModel> {
    return await this.userService.createOne(body);
  }
}
