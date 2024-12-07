import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';
import { FavoriteModel } from './favorite.model';

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

  @Column({ type: DataType.CHAR(128), allowNull: false })
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

  @Column({ type: DataType.CHAR(6), defaultValue: 'en' })
  language_code: string;

  @HasMany(() => AdvertisementModel)
  advertisements: AdvertisementModel[];

  @BelongsToMany(() => AdvertisementModel, () => FavoriteModel)
  favoriteAdvertisements: AdvertisementModel[];
}
