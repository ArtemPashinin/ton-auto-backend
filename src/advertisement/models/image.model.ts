import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { AdvertisementModel } from './advertisement.model';
@Table({ tableName: 'images', timestamps: true })
export class FileModel extends Model<FileModel> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

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

  @Column({ type: DataType.INTEGER, allowNull: false })
  order: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  main: boolean;
}
