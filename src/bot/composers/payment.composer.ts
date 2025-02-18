import { Injectable, OnModuleInit } from '@nestjs/common';
import { Composer, Context } from 'grammy';
import { TelegramBot } from '../bot.service';
import { ChatType } from '../enums/chat-types.enum';

@Injectable()
export class PaymentComposer implements OnModuleInit {
  private readonly composer = new Composer<Context>();

  constructor(private readonly telegramBot: TelegramBot) {}

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

  private async successfulPayment(ctx: Context) {
    if (!ctx.message || !ctx.message.successful_payment || !ctx.from) return;

    const paymentInfo = ctx.message.successful_payment;
    console.log(ctx.from);
    console.log(paymentInfo);
    const { id: userId } = ctx.from;
    await ctx.reply(JSON.stringify(paymentInfo)).catch((err) => {
      console.log(err);
    });
  }
}
