import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FavoriteModel } from './models/favorite.model';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';
import { AdvertisementsModule } from 'src/advertisement/advertisements.module';
import { CountryModel } from './models/country.model';
import { CityModel } from './models/city.model';

@Module({
  imports: [
    AdvertisementsModule,
    SequelizeModule.forFeature([
      UserModel,
      FavoriteModel,
      AdvertisementModel,
      CountryModel,
      CityModel,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
