import { cn } from '@gluestack-ui/utils';

import { Activity, type ComponentProps } from 'react';

import { format } from 'date-fns';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

import { ChatGroupWithUserDetails } from '@/features/chat/types/group-chats';

interface ChatGroupBubbleProps extends ComponentProps<typeof Box> {
  data: ChatGroupWithUserDetails;
}

const USER_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-pink-500',
];

export function getUserBubbleColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

export function ChatGroupBubble({ data, className, ...props }: ChatGroupBubbleProps) {
  const { mode, text, createdAt, senderName, senderAvatar } = data;
  const userColor = getUserBubbleColor(senderName);

  return (
    // 'w-full' ensures the row takes available space so self-end/start works,
    // without forcing the child to overflow
    <Box
      className={cn('w-full flex-row gap-x-2', mode === 'SENT' ? 'justify-end' : 'justify-start')}>
      <Activity mode={mode === 'RECEIVED' ? 'visible' : 'hidden'}>
        <Avatar>
          <AvatarImage source={senderAvatar ? { uri: senderAvatar } : undefined} />
          <AvatarFallbackText>{senderName[0]}</AvatarFallbackText>
        </Avatar>
      </Activity>

      <Box
        className={cn(
          // Replaced max-w-xs with max-w-[80%] to prevent screen overflow
          'my-1 max-w-[80%] shrink rounded-xl p-3',
          mode === 'SENT' ? 'bg-blue-600' : userColor,
          className
        )}
        {...props}>
        <Activity mode={mode === 'RECEIVED' ? 'visible' : 'hidden'}>
          <Text className="font-bold text-white">{senderName}</Text>
        </Activity>

        <Text className="text-white">{text}</Text>

        <Text className="mt-1 text-sm text-white/70">{format(new Date(createdAt), 'hh:mm a')}</Text>
      </Box>
    </Box>
  );
}
