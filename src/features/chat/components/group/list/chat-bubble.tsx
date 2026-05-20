import { cn } from '@gluestack-ui/utils';

import { Activity, useState, type ComponentProps } from 'react';

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
  const { mode, content, createdAt, senderName, senderAvatar } = data;

  const [isPressed, setIsPressed] = useState(false);

  const safeSenderName = senderName ?? 'Unknown';

  const userColor = getUserBubbleColor(safeSenderName);

  const senderInitial = safeSenderName[0] ?? '?';

  const isSent = mode === 'SENT';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onLongPress={(e) => {
        Haptics.impact('rigid');
        onLongPress?.(e);
      }}
      className={cn(
        'w-full flex-row gap-x-2 px-2 py-1',
        isSent ? 'justify-end' : 'justify-start',
        selected && 'bg-emerald-500/20 dark:bg-emerald-400/20',
        isPressed && 'opacity-70'
      )}>
      <Activity mode={!isSent ? 'visible' : 'hidden'}>
        <Avatar className="mt-1">
          <AvatarImage source={senderAvatar ? { uri: senderAvatar } : undefined} />

          <AvatarFallbackText>{senderInitial}</AvatarFallbackText>
        </Avatar>
      </Activity>

      <Box
        className={cn(
          'my-1 max-w-[80%] shrink rounded-2xl p-3',
          isSent ? 'bg-emerald-600/95 dark:bg-emerald-500/90' : userColor,
          className
        )}
        {...props}>
        <Activity mode={!isSent ? 'visible' : 'hidden'}>
          <Text className="mb-1 text-[13px] font-semibold text-white/90">{safeSenderName}</Text>
        </Activity>

        <Text className="text-[15px] leading-5 text-white">{content}</Text>

        <Box className="mt-1 flex-row justify-end">
          <Text className="text-[11px] text-white/70">
            {format(new Date(createdAt), 'hh:mm aa')}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
}
