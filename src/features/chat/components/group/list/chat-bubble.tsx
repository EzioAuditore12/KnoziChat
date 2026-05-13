import { cn } from '@gluestack-ui/utils';

import { Activity, type ComponentProps } from 'react';

import { format } from '@bernagl/react-native-date';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';

import { ChatGroupWithUserDetails } from '@/features/chat/types/group-chats';
import { Haptics } from 'react-native-nitro-haptics';

interface ChatGroupBubbleProps extends ComponentProps<typeof Box> {
  data: ChatGroupWithUserDetails;
  selected?: boolean;
  onPress?: ComponentProps<typeof Pressable>['onPress'];
  onLongPress?: ComponentProps<typeof Pressable>['onLongPress'];
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

export function ChatGroupBubble({
  data,
  className,
  selected,
  onPress,
  onLongPress,
  ...props
}: ChatGroupBubbleProps) {
  const { mode, text, createdAt, senderName, senderAvatar } = data;
  const userColor = getUserBubbleColor(senderName);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={(e) => {
        Haptics.impact('rigid');
        onLongPress?.(e);
      }}
      className={cn(
        'w-full flex-row gap-x-2 px-2 py-1 active:opacity-70',
        mode === 'SENT' ? 'justify-end' : 'justify-start',
        selected && 'bg-blue-500/20 dark:bg-blue-400/20'
      )}>
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

        <Text className="mt-1 text-sm text-white/70">
          {' '}
          {format(new Date(createdAt), 'hh:mm aa')}
        </Text>
      </Box>
    </Pressable>
  );
}
