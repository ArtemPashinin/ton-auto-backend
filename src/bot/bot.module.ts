import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramBot } from './bot.service';
import { UserComposer } from './composers/user.composer';

@Module({
  imports: [ConfigModule],
  providers: [TelegramBot, UserComposer],
  exports: [TelegramBot],
})
export class BotModule {}
