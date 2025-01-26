export interface QueryDto {
  page: number;
  make?: number;
  model?: number;
  engine?: number;
  color?: number;
  condition?: number;
  country?: number;
  city?: number;
  userId?: number;
  yearFrom?: number;
  yearTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  favorites?: boolean;
  commercial?: boolean;
  owned?: boolean;
  type?: string;
}
