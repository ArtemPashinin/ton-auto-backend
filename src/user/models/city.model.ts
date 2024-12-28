import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CountryModel } from './country.model';

@Table({ tableName: 'city', timestamps: false })
export class CityModel extends Model<CityModel> {
  @Column({ primaryKey: true, allowNull: false })
  id: number;

  @Column({ type: DataType.CHAR(64), allowNull: false })
  title: string;

  @ForeignKey(() => CountryModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  country_id: number;

  @BelongsTo(() => CountryModel)
  country: CountryModel;
}
