import { View, type ViewProps } from 'react-native';
import { cn } from 'tailwind-variants';
import { Description } from 'heroui-native/description';

import { DirectChat } from '@/db/models/direct-chat.model';

interface ChatTextProps extends ViewProps {
  data: DirectChat;
}

export function ChatText({ data, className, ...props }: ChatTextProps) {
  const { mode, text, createdAt } = data;

  return (
    <View
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
        {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Description>
    </View>
  );
}
