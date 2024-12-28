import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'engine_types', timestamps: false })
export class EngineModel extends Model<EngineModel> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  type: string;
}
