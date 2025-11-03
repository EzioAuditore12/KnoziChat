import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation {
  @Prop({
    type: [String],
    required: true,
    validate: [
      (val: string[]) => val.length >= 2,
      'A conversation must have at least 2 participants.',
    ],
    index: true,
  })
  participantIds: string[];

  @Prop({ type: Boolean, default: false })
  isGroup: boolean;

  @Prop({
    type: String,
    required: function (this: Conversation) {
      return this.isGroup;
    },
  })
  creatorId?: string;

  @Prop({
    type: String,
    trim: true,
    required: function (this: Conversation) {
      return this.isGroup;
    },
  })
  groupName?: string;

  @Prop({ type: String, required: false })
  groupAvatar?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

export type ConversationDocument = HydratedDocument<Conversation>;
