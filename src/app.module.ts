import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdvertisementsModule } from './advertisement/advertisements.module';
import { UserModule } from './user/user.module';
import { S3Module } from './s3/s3.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { BotModule } from './bot/bot.module';
import { HttpExceptionFilter } from './exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('HOST'),
        username: configService.get('DBUSERNAME'),
        password: configService.get('PASSWORD'),
        database: configService.get('DATABASE'),
        autoLoadModels: true,
        synchronize: configService.get<boolean>('SYNCHRONIZE'),
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AdvertisementsModule,
    BotModule,
    UserModule,
    S3Module,
    VehicleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
