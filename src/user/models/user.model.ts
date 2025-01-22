import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';
import { FavoriteModel } from './favorite.model';
import { CountryModel } from './country.model';
import { number } from 'joi';
import { CityModel } from './city.model';

@Table({
  tableName: 'users',
  timestamps: false,
})
export class UserModel extends Model<UserModel> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({ type: DataType.CHAR(128), allowNull: true })
  username: string;

  @Column({
    type: DataType.CHAR(128),
    allowNull: true,
  })
  first_name: string;

  @Column({
    type: DataType.CHAR(128),
    allowNull: true,
  })
  last_name: string;

  @Column({
    type: DataType.CHAR(128),
    allowNull: true,
  })
  phone: string;

  @ForeignKey(() => CityModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  city_id: number;

  @BelongsTo(() => CityModel)
  city: CityModel;

  @Column({ type: DataType.CHAR(6), defaultValue: 'en' })
  language_code: string;

  @HasMany(() => AdvertisementModel)
  advertisements: AdvertisementModel[];

  @BelongsToMany(() => AdvertisementModel, () => FavoriteModel)
  favoriteAdvertisements: AdvertisementModel[];
}
