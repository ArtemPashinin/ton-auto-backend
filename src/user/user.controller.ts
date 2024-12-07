import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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

@Controller('user')
@UseFilters(UserExceptionFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly advertisementService: AdvertisementService,
  ) {}

  @Get(':id')
  public async findOneByTgId(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOneByTgId(id);
  }

  @Post('favorite')
  public async addFavorite(
    @Body(new UserValidationPipe(favoriteSchema)) body: FavoriteDto,
  ): Promise<FavoriteModel> {
    const user = await this.userService.findOneById(body.userId);
    const advertisement = await this.advertisementService.findById(
      body.advertisementId,
    );
    if (user && advertisement) {
      return await this.userService.createFavorite(body);
    }
  }

  @Post()
  public async createOne(
    @Body(new UserValidationPipe(userSchema)) body: UserDto,
  ): Promise<UserModel> {
    return await this.userService.createOne(body);
  }
}
