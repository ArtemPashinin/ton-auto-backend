import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { MakeModel } from './make.model';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';

@Table({ tableName: 'models', timestamps: false })
export class CarModel extends Model<CarModel> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => MakeModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  make_id: number;

  @HasMany(() => AdvertisementModel)
  advertisements: AdvertisementModel[];

  @BelongsTo(() => MakeModel)
  make: MakeModel;

  @Column({ type: DataType.STRING })
  model: string;
}
