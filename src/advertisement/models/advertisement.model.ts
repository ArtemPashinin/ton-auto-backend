import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  Sequelize,
  HasMany,
} from 'sequelize-typescript';
import { UserModel } from 'src/user/models/user.model';
import { FileModel } from './image.model';

@Table({
  tableName: 'advertisements',
  timestamps: true,
})
export class AdvertisementModel extends Model<AdvertisementModel> {
  @Column({
    primaryKey: true,
    type: DataType.CHAR(128),
  })
  id: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @Column({
    type: DataType.CHAR(128),
    allowNull: true,
  })
  make: string;

  @Column({
    type: DataType.CHAR(128),
    allowNull: true,
  })
  model: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  year: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  hp: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  mileage: number;

  @Column({
    type: DataType.CHAR(128),
    allowNull: true,
  })
  engine: string;

  @Column({
    type: DataType.CHAR(128),
    allowNull: true,
  })
  color: string;

  @Column({
    type: DataType.CHAR(128),
    allowNull: true,
  })
  region: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  price: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @Column({
    type: DataType.CHAR(6),
    allowNull: true,
  })
  currency: string;

  @HasMany(() => FileModel)
  images: FileModel[];
}
