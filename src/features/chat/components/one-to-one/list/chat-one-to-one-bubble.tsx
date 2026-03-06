import { cn } from 'tailwind-variants';
import { Description } from 'heroui-native/description';
import { Surface, type SurfaceRootProps } from 'heroui-native/surface';

import { ChatOneToOne } from '@/db/tables/chat-one-to-one.table';

interface ChatOneToOneBubbleProps extends SurfaceRootProps {
  data: ChatOneToOne;
}

export function ChatOneToOneBubble({ data, className, ...props }: ChatOneToOneBubbleProps) {
  const { mode, text, createdAt } = data;

  return (
    <Surface
      className={cn(
        'my-1 max-w-xs rounded-xl p-3',
        mode === 'SENT' ? 'self-end' : 'self-start',
        mode === 'SENT' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}>
      <Description className={mode === 'SENT' ? 'text-white' : 'text-black dark:text-white'}>
        {text}
      </Description>
      <Description
        className="text-sm"
        style={{
          color: mode === 'SENT' ? '#dbeafe' : '#6b7280',
        }}>
        {new Date(createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Description>
    </Surface>
  );
}
