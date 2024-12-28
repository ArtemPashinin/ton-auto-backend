import { Module } from '@nestjs/common';
import { AdvertisementService } from './advertisements.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdvertisementModel } from './models/advertisement.model';
import { UserModel } from 'src/user/models/user.model';
import { AdvertisementsController } from './advertisements.contorller';
import { FileModel } from './models/image.model';
import { S3Module } from 'src/s3/s3.module';
import { FavoriteModel } from 'src/user/models/favorite.model';
import { ConditionModel } from '../vehicle/models/condition.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AdvertisementModel,
      UserModel,
      FileModel,
      FavoriteModel,
      ConditionModel,
    ]),
    S3Module,
  ],
  controllers: [AdvertisementsController],
  providers: [AdvertisementService],
  exports: [AdvertisementService],
})
export class AdvertisementsModule {}
