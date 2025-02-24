import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { CarModel } from './car-model.model';


@Table({ tableName: 'makes', timestamps: false })
export class MakeModel extends Model<MakeModel> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.CHAR(256) })
  make: string;

  @HasMany(() => CarModel)
  models: CarModel[];
}