import { Pressable, type PressableProps } from 'react-native';
import { cn } from '@gluestack-ui/utils/nativewind-utils';

import { Text } from '@/components/ui/text';

import { DirectChat } from '@/db/models/direct-chat.model';

interface ChatTextProps extends PressableProps {
  data: DirectChat;
}

export function ChatText({ className, data, ...props }: ChatTextProps) {
  const { text } = data;

  return (
    <Pressable
      className={cn('rounded-md bg-gray-200 p-2 shadow-2xl', className)}
      {...props}
    >
      <Text className="text-center font-semibold">{text}</Text>
    </Pressable>
  );
}
