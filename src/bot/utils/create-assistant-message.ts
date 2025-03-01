import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';

export function createAdvertisementMessage(
  advertisement: AdvertisementModel,
): string {
  return `<b>${advertisement.model.make.make} ${advertisement.model.model}</b>

📆${advertisement.year}
🔘${advertisement.mileage} km
⛽️${advertisement.engine.type}
🐎${advertisement.hp}
🌈${advertisement.color.color}
📍${advertisement.fict_country.title || advertisement.user.city.country.title}, ${advertisement.fict_city.title || advertisement.user.city.title}

${advertisement.description}

💰${advertisement.price} ${advertisement.fict_country.currency || advertisement.user.city.country.currency}`;
}
