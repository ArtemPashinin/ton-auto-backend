import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'condition', timestamps: false })
export class ConditionModel extends Model<ConditionModel> {
  @Column({ primaryKey: true, type: DataType.INTEGER, allowNull: false })
  id: number;

  @Column({ type: DataType.CHAR(36), allowNull: false })
  title: string;
}
