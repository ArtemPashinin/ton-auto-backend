import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({ tableName: 'makes', timestamps: false })
export class MakeModel extends Model<MakeModel> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.CHAR(256) })
  make: string;
}
