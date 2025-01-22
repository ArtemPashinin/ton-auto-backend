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
    const media = InputMediaBuilder.photo(
      new InputFile(
        new URL(
          'https://s3.ru1.storage.beget.cloud/8f8514fa4b7f-uncreative-gustofer/images/767ac05a-89ba-4309-9ab5-388db943cdb1-Frame52.jpg',
        ),
      ),
      { caption: 'Cool!', parse_mode: 'HTML' },
    );
    await ctx.replyWithMediaGroup([media]);
  }
}
