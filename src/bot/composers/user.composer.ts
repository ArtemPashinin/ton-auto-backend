import { Injectable, OnModuleInit } from '@nestjs/common';
import { Composer, Context, InlineKeyboard } from 'grammy';
import { TelegramBot } from '../bot.service';
import { ChatType } from '../enums/chat-types.enum';

@Injectable()
export class UserComposer implements OnModuleInit {
  private readonly composer = new Composer<Context>();
  private openWebAppButton: InlineKeyboard;

  constructor(private readonly telegramBot: TelegramBot) {}

  async onModuleInit() {
    this.openWebAppButton = new InlineKeyboard().webApp(
      'Open app',
      this.telegramBot.getWebAppInfo(),
    );
    this.registerHandlers();
    this.telegramBot.getBot().chatType(ChatType.PRIVATE).use(this.composer);
  }

  private registerHandlers(): void {
    this.composer.command('start', (ctx) => this.start(ctx));
  }

  private async start(ctx: Context): Promise<void> {
    await ctx.reply(
      `🚗 Welcome to AutoHub!
Looking for a new ride or ready to sell your car? I'm here to make it quick and simple!
✅ Browse listings for new and used cars
✅ Post your car for sale in just a few steps
Let’s find your perfect match`,
      { reply_markup: this.openWebAppButton },
    );
  }
}
