import { Controller, Get } from '@nestjs/common';
import { TelegramBot } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly telegramBot: TelegramBot) {}

  @Get()
  async createInvoiceLink() {
    const bot = this.telegramBot.getBot();
    const link = await bot.api.createInvoiceLink(
      'Title', //title
      'Some description', //description
      '{}', //payload
      '', // For Telegram Stars payment this should be empty
      'XTR', //currency
      [{ amount: 1, label: 'Star' }], //prices
    );
    console.log(link);
    return link;
  }
}
