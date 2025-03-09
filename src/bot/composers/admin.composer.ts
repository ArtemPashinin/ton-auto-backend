import { Composer, Context } from 'grammy';
import { AdvertisementService } from 'src/advertisement/advertisements.service';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramBot } from '../bot.service';
import { ChatType } from '../enums/chat-types.enum';
import { isUserAdminFilter } from '../filters/is-user-admin.filter';

@Injectable()
export class AdminComposer implements OnModuleInit {
  private readonly composer = new Composer<Context>();

  constructor(
    private readonly configService: ConfigService,
    private readonly telegramBot: TelegramBot,
    private readonly advertisementsService: AdvertisementService,
  ) {}

  async onModuleInit() {
    this.registerHandlers();
    this.telegramBot
      .getBot()
      .chatType(ChatType.PRIVATE)
      .filter(isUserAdminFilter(this.telegramBot.getAdminIdList()))
      .use(this.composer);
  }

  private registerHandlers(): void {
    this.composer.command('stat', (ctx) => this.preCheckoutQuery(ctx));
  }

  private async preCheckoutQuery(ctx: Context): Promise<void> {
    try {
      const result = await this.advertisementsService.statistic();
      await ctx.reply(
        `🌏Общее кол-во объявлений: <b>${result.totalCount}</b>${result.result}\n🌏Общее кол-во объявлений(без администратора): <b>${result.totalWithoutAdmin}</b> ${result.resultWithoutAdmin}`.replace(
          /{|}|,|"/g,
          '',
        ),
        { parse_mode: 'HTML' },
      );
    } catch (err) {
      await ctx.reply('Что-то пошло не так...');
    }
  }
}
