import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';

export interface SearchResultDto {
  advertisements: AdvertisementModel[];
  count: number;
}
