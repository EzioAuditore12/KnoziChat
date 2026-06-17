import { PendingIcon } from './icons/PendingIcon';
import { FailedIcon } from './icons/FailedIcon';
import { TickDouble } from './icons/TickDouble';
import { TickSingle } from './icons/TickSingle';

import { DirectChatWithAttachment } from '@/features/chat/types/direct-chats';

interface StatusIconProps {
  status: DirectChatWithAttachment['status'];
  color?: string;
  size?: number;
}

export function StatusIcon({ status, color = '#dbeafe', size = 16 }: StatusIconProps) {
  if (status === 'PENDING') {
    return <PendingIcon color={color} size={size} />;
  }
  if (status === 'FAILED') {
    return <FailedIcon size={size} />;
  }
  if (status === 'DELIVERED') {
    return <TickDouble colorStart={color} colorEnd={color} size={size} />;
  }
  if (status === 'SEEN') {
    return <TickDouble size={size} />;
  }
  if (status === 'SENT') {
    return <TickSingle color={color} size={size} />;
  }
  return null;
}
