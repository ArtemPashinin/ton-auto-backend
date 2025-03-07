import { AdvertisementsModule } from 'src/advertisement/advertisements.module';

import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotController } from './bot.controller';
import { TelegramBot } from './bot.service';
import { AdminComposer } from './composers/admin.composer';
import { PaymentComposer } from './composers/payment.composer';
import { UserComposer } from './composers/user.composer';

@Module({
  imports: [ConfigModule, forwardRef(() => AdvertisementsModule)],
  providers: [TelegramBot, UserComposer, PaymentComposer, AdminComposer],
  exports: [TelegramBot],
  controllers: [BotController],
})
export class BotModule {}