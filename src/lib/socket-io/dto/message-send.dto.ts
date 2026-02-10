export type SendMessageDto = {
  _id: string;
  conversationId: string;
  receiverId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};
