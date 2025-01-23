import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserModel } from 'src/user/models/user.model';
import { FileModel } from './image.model';
import { FavoriteModel } from 'src/user/models/favorite.model';
import { ConditionModel } from '../../vehicle/models/condition.model';
import { MakeModel } from 'src/vehicle/models/make.model';
import { CarModel } from 'src/vehicle/models/car-model.model';
import { EngineModel } from 'src/vehicle/models/engine.model';
import { ColorModel } from 'src/vehicle/models/color.model';
import { PostAdvertisementModel } from './post-advertisement.model';

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

  @ForeignKey(() => EngineModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  engine_id: number;

  @BelongsTo(() => EngineModel)
  engine: EngineModel;

  @ForeignKey(() => ColorModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  color_id: number;

  @BelongsTo(() => ColorModel)
  color: ColorModel;

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

  @Column({ type: DataType.BOOLEAN })
  commercial: boolean;

  @ForeignKey(() => ConditionModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  condition_id: number;

  @BelongsTo(() => ConditionModel)
  condition: ConditionModel;

  @ForeignKey(() => CarModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  model_id: number;

  @BelongsTo(() => CarModel)
  model: CarModel;

  @HasMany(() => FileModel)
  media: FileModel[];

  @BelongsToMany(() => UserModel, () => FavoriteModel)
  favoritedBy: UserModel[];

  @HasMany(() => PostAdvertisementModel)
  posts: PostAdvertisementModel[];
}
