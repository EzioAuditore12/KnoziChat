import { cn } from '@gluestack-ui/utils';
import type { ComponentProps } from 'react';
import { Haptics } from 'react-native-nitro-haptics';

import { format } from '@bernagl/react-native-date';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';

import type { ChatDirect } from '@/db/tables/chat-direct.table';

interface ChatOneToOneBubbleProps extends ComponentProps<typeof Box> {
  data: ChatDirect;
  selected?: boolean;
  onPress?: ComponentProps<typeof Pressable>['onPress'];
  onLongPress?: ComponentProps<typeof Pressable>['onLongPress'];
}

export function ChatOneToOneBubble({
  data,
  className,
  selected,
  onPress,
  onLongPress,
  ...props
}: ChatOneToOneBubbleProps) {
  const { mode, content, createdAt } = data;

  return (
    <Pressable
      className={cn(
        'w-full flex-row px-2 py-1 active:opacity-70',
        mode === 'SENT' ? 'justify-end' : 'justify-start',
        selected && 'bg-blue-500/20 dark:bg-blue-400/20'
      )}
      onPress={onPress}
      onLongPress={(e) => {
        Haptics.impact('rigid');
        onLongPress?.(e);
      }}>
      <Box
        className={cn(
          'my-1 max-w-[80%] shrink rounded-xl p-3',
          mode === 'SENT' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
          className
        )}
        {...props}>
        <Text className={mode === 'SENT' ? 'text-white' : 'text-black dark:text-white'}>
          {content}
        </Text>
        <Text
          className="mt-1 text-sm"
          style={{
            color: mode === 'SENT' ? '#dbeafe' : '#6b7280',
          }}>
          {format(new Date(createdAt), 'hh:mm aa')}
        </Text>
      </Box>
    </Pressable>
  );
}
