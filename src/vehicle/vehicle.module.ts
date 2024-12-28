import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MakeModel } from './models/make.model';
import { VehicleService } from './vehicle.service';
import { CarModel } from './models/car-model.model';
import { EngineModel } from './models/engine.model';
import { ColorModel } from './models/color.model';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';
import { ConditionModel } from './models/condition.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      MakeModel,
      CarModel,
      EngineModel,
      ColorModel,
      ConditionModel,
    ]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
