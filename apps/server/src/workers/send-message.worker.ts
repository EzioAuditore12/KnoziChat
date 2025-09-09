import { WorkerHost, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('send-message')
export class SendMessage extends WorkerHost {
  process(job: Job, token?: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
