import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { MakeModel } from './models/make.model';
import { CarModel } from './models/car-model.model';
import { EngineModel } from './models/engine.model';
import { ColorModel } from './models/color.model';
import { ConditionModel } from './models/condition.model';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('makes')
  public async getMakes(): Promise<MakeModel[]> {
    return await this.vehicleService.getMakes();
  }

  @Get('models/:id')
  public async getModels(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CarModel[]> {
    return await this.vehicleService.getModelsByMake(id);
  }

  @Get('engineTypes')
  public async getEngineTypes(): Promise<EngineModel[]> {
    return await this.vehicleService.getEngineTypes();
  }

  @Get('colors')
  public async getColors(): Promise<ColorModel[]> {
    return await this.vehicleService.getColors();
  }

  @Get('conditions')
  public async findAllConfitions(): Promise<ConditionModel[]> {
    return await this.vehicleService.findAllCondition();
  }
}
