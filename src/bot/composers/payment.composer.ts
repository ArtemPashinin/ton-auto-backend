import { Composer, Context } from 'grammy';
import { AdvertisementService } from 'src/advertisement/advertisements.service';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramBot } from '../bot.service';

@Injectable()
export class PaymentComposer implements OnModuleInit {
  private readonly composer = new Composer<Context>();

  constructor(
    private readonly telegramBot: TelegramBot,
    private readonly advertisementsService: AdvertisementService,
  ) {}

  async onModuleInit() {
    this.registerHandlers();
    this.telegramBot.getBot().use(this.composer);
  }

  private registerHandlers(): void {
    this.composer.on('pre_checkout_query', (ctx) => this.preCheckoutQuery(ctx));
    this.composer.on('message:successful_payment', (ctx) =>
      this.successfulPayment(ctx),
    );
  }

  private async preCheckoutQuery(ctx: Context): Promise<boolean | void> {
    return await ctx.answerPreCheckoutQuery(true).catch(() => {
      console.error('answer failed');
    });
  }

  private async successfulPayment(ctx: Context): Promise<void> {
    if (!ctx.message || !ctx.message.successful_payment || !ctx.from) return;
    const { advertisement_id: id } = JSON.parse(
      ctx.message.successful_payment.invoice_payload,
    );

    const advertisement = await this.advertisementsService.setPaid(id);
    if (advertisement && advertisement.paid) {
      const postsId =
        await this.telegramBot.sendAdvertisementToGroup(advertisement);

      await this.advertisementsService.createPosts(id, postsId);
    }
  }
}