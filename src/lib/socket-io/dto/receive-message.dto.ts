export type ReceiveMessageDto = {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  delivered: boolean;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};
