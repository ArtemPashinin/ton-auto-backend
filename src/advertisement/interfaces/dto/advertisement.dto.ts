export interface AdvertisementDto {
  id?: string;
  user_id: number;
  make: string;
  model: string;
  year: number;
  hp: number;
  mileage: number;
  engine: string;
  color: string;
  region: string;
  price: number;
  description: string;
  currency: string;
}
