import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AdvertisementModel } from './advertisement.model';
@Table({ tableName: 'images', timestamps: true })
export class FileModel extends Model<FileModel> {
  @Column
  image_url: string;

  @ForeignKey(() => AdvertisementModel)
  @Column
  advertisement_id: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @BelongsTo(() => AdvertisementModel)
  advertisement: AdvertisementModel;
}
