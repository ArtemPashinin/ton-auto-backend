import { MetaDto } from './meta.dto';

export interface AdvertisementDto {
  id?: string;
  user_id: number;
  model_id: number;
  year: number;
  hp: number;
  mileage: number;
  engine_id: number;
  color_id: number;
  price: number;
  description: string;
  meta: MetaDto[];
}
