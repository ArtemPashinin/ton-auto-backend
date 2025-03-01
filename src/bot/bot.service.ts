import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import { WebAppInfo } from 'grammy/types';
import { AdvertisementModel } from 'src/advertisement/models/advertisement.model';
import { createAdvertisementMessage } from './utils/create-assistant-message';
import { mediaBuilder } from './utils/media-builder';

@Injectable()
export class TelegramBot {
  private bot: Bot;
  private mainGroupId: string | number;
  private errorLogChatId: string | number;
  private webAppInfo: WebAppInfo;
  private errorLogging = false;
  private errorLogTimeout = 5000;
  private placePrice: number;

  constructor(private readonly configService: ConfigService) {
    this.mainGroupId = configService.get<number | string>('MAIN_GROUP');
    this.errorLogChatId = configService.get<number | string>(
      'ERROR_LOG_CHAT_ID',
    );
    this.webAppInfo = { url: configService.get<string>('WEBAPP_URL') };
    this.placePrice = configService.get<number>('PLACE_PRICE');
    this.bot = new Bot(configService.get<string>('BOT_TOKEN'), {
      client: {
        environment:
          configService.get<'test' | 'prod'>('BOT_ENVIRONMENT') || 'prod',
      },
    });

    this.bot.catch((error) => {
      if (!this.errorLogging) {
        this.bot.api.sendMessage(this.errorLogChatId, JSON.stringify(error));
        this.errorLogging = true;
      }
      setTimeout(() => {
        this.errorLogging = false;
      }, this.errorLogTimeout);
    });
  }

  async onApplicationBootstrap() {
    this.bot.start();
  }

  public getBot(): Bot {
    return this.bot;
  }

  public getMainGroupId(): string | number {
    return this.mainGroupId;
  }

  public getWebAppInfo(): WebAppInfo {
    return this.webAppInfo;
  }

  public async createInvoiceLink(
    payload: Record<string, string | number>,
  ): Promise<string> {
    return await this.bot.api.createInvoiceLink(
      'Publish advertisement',
      'stars payment',
      JSON.stringify(payload),
      'provider_token',
      'XTR',
      [{ amount: this.placePrice, label: 'Publish advertisement' }],
    );
  }

  public async sendMessageToUser(userId: number, text: string): Promise<void> {
    await this.bot.api.sendMessage(userId, text);
  }

  public async sendErrorLog(error): Promise<void> {
    await this.bot.api.sendMessage(this.errorLogChatId, JSON.stringify(error));
  }

  public async sendAdvertisementToGroup(
    advertisement: AdvertisementModel,
  ): Promise<number[]> {
    const caption = createAdvertisementMessage(
      advertisement.get({ plain: true }),
    );
    const mediaGroup = mediaBuilder(advertisement.media, caption);
    const messages = await this.bot.api.sendMediaGroup(
      this.mainGroupId,
      mediaGroup,
    );
    return messages.map(({ message_id }) => message_id);
  }

  public async removePosts(postsId: number[]): Promise<void> {
    try {
      await this.bot.api.deleteMessages(this.mainGroupId, postsId);
    } catch (_) {}
  }
}
