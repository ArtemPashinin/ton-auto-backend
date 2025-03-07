import { BotModule } from 'src/bot/bot.module';
import { S3Module } from 'src/s3/s3.module';
import { CountryModel } from 'src/user/models/country.model';
import { FavoriteModel } from 'src/user/models/favorite.model';
import { UserModel } from 'src/user/models/user.model';
import { UserModule } from 'src/user/user.module';

import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdvertisementsController } from './advertisements.contorller';
import { AdvertisementService } from './advertisements.service';
import { AdvertisementModel } from './models/advertisement.model';
import { FileModel } from './models/image.model';
import { PostAdvertisementModel } from './models/post-advertisement.model';
import { ConditionModel } from '../vehicle/models/condition.model';

@Module({
  imports: [
    BotModule,
    SequelizeModule.forFeature([
      AdvertisementModel,
      UserModel,
      FileModel,
      FavoriteModel,
      PostAdvertisementModel,
      ConditionModel,
      CountryModel,
    ]),
    S3Module,
    forwardRef(() => UserModule),
  ],
  controllers: [AdvertisementsController],
  providers: [AdvertisementService],
  exports: [AdvertisementService],
})
export class AdvertisementsModule {}