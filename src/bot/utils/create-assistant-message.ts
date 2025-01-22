import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';

export function createAdvertisementMessage(
  advertisement: AdvertisementModel,
): string {
  console.log(advertisement);
  return `<b>${advertisement.model.make.make} ${advertisement.model.model}</b>

📆${advertisement.year}
🔘${advertisement.mileage} km
⛽️${advertisement.engine.type}
🐎${advertisement.hp}
🌈${advertisement.color}
📍${advertisement.user.city.country.title}, ${advertisement.user.city.title}

${advertisement.description}

💰${advertisement.price} ${advertisement.user.city.country.currency}`;
}
