import { Module } from '@nestjs/common';
import { SendMessage, sendSmsQueueName } from './workers/send-message.worker';
import { BullModule } from '@nestjs/bullmq';
import { SendMessageService } from './services/send-sms.service';

@Module({
  imports: [BullModule.registerQueue({ name: sendSmsQueueName })],
  controllers: [],
  providers: [SendMessage, SendMessageService],
  exports: [SendMessageService],
})
export class CommonModule {}
