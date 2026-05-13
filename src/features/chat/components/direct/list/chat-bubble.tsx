import { cn } from '@gluestack-ui/utils';
import type { ComponentProps } from 'react';

import { format } from 'date-fns';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';

import type { ChatDirect } from '@/db/tables/chat-direct.table';

interface ChatOneToOneBubbleProps extends ComponentProps<typeof Box> {
  data: ChatDirect;
  onPress?: ComponentProps<typeof Pressable>['onPress'];
  onLongPress?: ComponentProps<typeof Pressable>['onLongPress'];
}

export function ChatOneToOneBubble({
  data,
  className,
  onPress,
  onLongPress,
  ...props
}: ChatOneToOneBubbleProps) {
  const { mode, text, createdAt } = data;

  return (
    <Pressable
      className={cn(
        'w-full flex-row active:opacity-70',
        mode === 'SENT' ? 'justify-end' : 'justify-start'
      )}
      onPress={onPress}
      onLongPress={onLongPress}>
      <Box
        className={cn(
          'my-1 max-w-[80%] shrink rounded-xl p-3',
          mode === 'SENT' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
          className
        )}
        {...props}>
        <Text className={mode === 'SENT' ? 'text-white' : 'text-black dark:text-white'}>
          {text}
        </Text>
        <Text
          className="mt-1 text-sm"
          style={{
            color: mode === 'SENT' ? '#dbeafe' : '#6b7280',
          }}>
          {format(new Date(createdAt), 'hh:mm a')}
        </Text>
      </Box>
    </Pressable>
  );
}
