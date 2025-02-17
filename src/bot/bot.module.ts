import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramBot } from './bot.service';
import { UserComposer } from './composers/user.composer';
import { BotController } from './bot.controller';

@Module({
  imports: [ConfigModule],
  providers: [TelegramBot, UserComposer],
  exports: [TelegramBot],
  controllers: [BotController],
})
export class BotModule {}
