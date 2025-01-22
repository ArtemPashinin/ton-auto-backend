import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { CountryModel } from './models/country.model';
import { CityModel } from './models/city.model';

@Controller('user')
@UseFilters(UserExceptionFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly advertisementService: AdvertisementService,
  ) {}

  @Get()
  public async findOne(
    @Query(new UserValidationPipe(findUserSchema)) userId: FindtUserDto,
  ): Promise<UserModel> {
    return await this.userService.findOne(userId);
  }

  @Get('countries')
  public async getCountries(): Promise<CountryModel[]> {
    return await this.userService.findAllCountries();
  }

  @Get('cities/:id')
  public async getCities(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CityModel[]> {
    return await this.userService.findCities(id);
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
        try {
          return await this.userService.createFavorite(
            user.id,
            body.advertisementId,
          );
        } catch (err) {
          console.log(err);
        }
      }
      await this.userService.removeFavorite(user.id, body.advertisementId);
    }
  }

  @Post()
  public async createOne(
    @Body(new UserValidationPipe(userSchema)) body: UserDto,
  ): Promise<boolean> {
    return await this.userService.createOne(body);
  }

  @Put()
  public async updateOne(
    @Query(new UserValidationPipe(findUserSchema)) userId: FindtUserDto,
    @Body(new UserValidationPipe(userSchema))
    body: UserDto,
  ): Promise<UserModel> {
    return await this.userService.updateOne(userId, body);
  }
}
