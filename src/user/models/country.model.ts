import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';

import { CityModel } from './city.model';

@Table({ tableName: 'country', timestamps: false })
export class CountryModel extends Model<CountryModel> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.CHAR(64), allowNull: false })
  title: string;

  @Column({ type: DataType.CHAR(16), allowNull: true })
  currency: string;

  @Column({ type: DataType.CHAR(8), allowNull: true, defaultValue: '+1' })
  phone_code: string;

  @HasMany(() => CityModel)
  cities: CityModel[];
}
