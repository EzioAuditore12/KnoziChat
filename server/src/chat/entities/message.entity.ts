import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Conversation } from './conversation.entity';

@Schema({ timestamps: true })
export class Message {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  })
  conversationId: Conversation;

  @Prop({ required: true, type: String, index: true })
  senderId: string;

  @Prop({ type: String, required: true, trim: true })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export type MessageDocument = HydratedDocument<Message>;
