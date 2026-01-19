import type { UserDto } from '../../user/types';

export type ConversationDto = {
  id: string;
  user: UserDto;
  createdAt: 'Date';
  updatedAt: 'Date';
};
