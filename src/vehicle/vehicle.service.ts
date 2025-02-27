import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MakeModel } from './models/make.model';
import { CarModel } from './models/car-model.model';
import { EngineModel } from './models/engine.model';
import { ColorModel } from './models/color.model';
import { ConditionModel } from './models/condition.model';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(MakeModel) private readonly makeModel: typeof MakeModel,
    @InjectModel(CarModel) private readonly carModel: typeof CarModel,
    @InjectModel(EngineModel) private readonly engineModel: typeof EngineModel,
    @InjectModel(ColorModel) private readonly colorModel: typeof ColorModel,
    @InjectModel(ConditionModel)
    private readonly conditionModel: typeof ConditionModel,
  ) {}

  public async getMakes(): Promise<MakeModel[]> {
    return await this.makeModel.findAll();
  }

  public async getExistsMakes(): Promise<MakeModel[]> {
    const makes = await MakeModel.findAll({
      include: [
        {
          attributes: [],
          model: CarModel,
          include: [
            {
              attributes: [],
              model: AdvertisementModel,
              where: {},
              required: true,
            },
          ],
          required: true,
        },
      ],
      group: ['MakeModel.id'],
    });
    return makes;
  }

  public async getExistsModelsByMake(id: number): Promise<CarModel[]> {
    const models = await CarModel.findAll({
      attributes: ['id', 'model'],
      include: [
        {
          attributes: [],
          model: AdvertisementModel,
          where: {},
          required: true,
        },
      ],
      where: {
        make_id: id,
      },
      group: ['CarModel.id'],
    });

    return models;
  }

  public async getModelsByMake(id: number): Promise<CarModel[]> {
    return await this.carModel.findAll({
      include: [
        { model: MakeModel, as: 'make', required: true, where: { id: id } },
      ],
    });
  }

  public async findMakeByModelId(id: number): Promise<MakeModel> {
    return await this.makeModel.findOne({
      include: [
        {
          attributes: [],
          model: CarModel,
          as: 'models',
          required: true,
          where: { id: id },
        },
      ],
    });
  }

  public async getEngineTypes(): Promise<EngineModel[]> {
    return await this.engineModel.findAll();
  }

  public async getColors(): Promise<ColorModel[]> {
    return await this.colorModel.findAll();
  }

  public async findAllCondition(): Promise<ConditionModel[]> {
    return await this.conditionModel.findAll();
  }
}
