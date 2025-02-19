import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramBot } from './bot.service';
import { UserComposer } from './composers/user.composer';
import { BotController } from './bot.controller';
import { PaymentComposer } from './composers/payment.composer';
import { AdvertisementsModule } from 'src/advertisement/advertisements.module';

@Module({
  imports: [ConfigModule, forwardRef(() => AdvertisementsModule),],
  providers: [TelegramBot, UserComposer, PaymentComposer],
  exports: [TelegramBot],
  controllers: [BotController],
})
export class BotModule {}
