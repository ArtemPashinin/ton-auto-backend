import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'colors', timestamps: false })
export class ColorModel extends Model<ColorModel> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  color: string;
}
