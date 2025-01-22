import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Composer,
  Context,
  InlineKeyboard,
  InputFile,
  InputMediaBuilder,
} from 'grammy';
import { TelegramBot } from '../bot.service';
import { ChatType } from '../enums/chat-types.enum';

@Injectable()
export class UserComposer implements OnModuleInit {
  private readonly composer = new Composer<Context>();
  private openWebAppButton: InlineKeyboard;

  constructor(private readonly telegramBot: TelegramBot) {}

  async onModuleInit() {
    this.openWebAppButton = new InlineKeyboard().webApp(
      'Обменять валюту',
      this.telegramBot.getWebAppInfo(),
    );
    this.registerHandlers();
    this.telegramBot.getBot().chatType(ChatType.PRIVATE).use(this.composer);
  }

  private registerHandlers(): void {
    this.composer.command('start', (ctx) => this.start(ctx));
  }

  private async start(ctx: Context): Promise<void> {
    await ctx.reply('Hi!');
  }
}
