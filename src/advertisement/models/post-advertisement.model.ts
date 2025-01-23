import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { AdvertisementModel } from './advertisement.model';
@Table({ tableName: 'post_advertisement', timestamps: false })
export class PostAdvertisementModel extends Model<PostAdvertisementModel> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER })
  post_id: number;

  @ForeignKey(() => AdvertisementModel)
  @Column
  advertisement_id: string;

  @BelongsTo(() => AdvertisementModel)
  advertisement: AdvertisementModel;
}
