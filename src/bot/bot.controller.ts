import { Body, Controller, Post } from '@nestjs/common';
import { TelegramBot } from './bot.service';
import { CreatePaymentLinkDto } from './interfaces/dto/create-payment-link.dto';

@Controller('bot')
export class BotController {
  constructor(private readonly telegramBot: TelegramBot) {}

  @Post('payload')
  async createInvoiceLink(@Body() body: CreatePaymentLinkDto): Promise<string> {
    const { advertisement_id } = body;

    return await this.telegramBot.createInvoiceLink({
      advertisement_id: advertisement_id,
    });
  }
}
