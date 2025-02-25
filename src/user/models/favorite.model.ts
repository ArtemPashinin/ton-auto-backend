import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';
import { UserModel } from './user.model';

@Table({ tableName: 'favorites', timestamps: true })
export class FavoriteModel extends Model<FavoriteModel> {
  @ForeignKey(() => UserModel)
  @Column
  user_id: number;

  @ForeignKey(() => AdvertisementModel)
  @Column
  advertisement_id: string;
}
