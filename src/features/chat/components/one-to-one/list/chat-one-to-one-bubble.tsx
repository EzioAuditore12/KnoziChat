import { View } from 'react-native';
import { cn } from 'tailwind-variants';
import { Description } from 'heroui-native/description';
import { Surface, type SurfaceRootProps } from 'heroui-native/surface';
import { format } from 'date-fns';

import { ChatOneToOne } from '@/db/tables/chat-one-to-one.table';

interface ChatOneToOneBubbleProps extends SurfaceRootProps {
  data: ChatOneToOne;
}

export function ChatOneToOneBubble({ data, className, ...props }: ChatOneToOneBubbleProps) {
  const { mode, text, createdAt } = data;

  return (
    <View className={cn('w-full flex-row', mode === 'SENT' ? 'justify-end' : 'justify-start')}>
      <Surface
        className={cn(
          'my-1 max-w-[80%] shrink rounded-xl p-3',
          mode === 'SENT' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
          className
        )}
        {...props}>
        <Description className={mode === 'SENT' ? 'text-white' : 'text-black dark:text-white'}>
          {text}
        </Description>
        <Description
          className="mt-1 text-sm"
          style={{
            color: mode === 'SENT' ? '#dbeafe' : '#6b7280',
          }}>
          {format(new Date(createdAt), 'hh:mm a')}
        </Description>
      </Surface>
    </View>
  );
}
