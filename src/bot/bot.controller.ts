import { Controller, Post } from '@nestjs/common';
import { TelegramBot } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly telegramBot: TelegramBot) {}

  @Post()
  async createInvoiceLink(): Promise<string> {
    const bot = this.telegramBot.getBot();
    const link = await bot.api.createInvoiceLink(
      'Donate',
      'stars donate',
      '{"advertisement_id": "123"}',
      'provider_token',
      'XTR',
      [{ amount: 1, label: 'Donate' }], //prices
    );
    console.log(link);
    return link;
  }
}
