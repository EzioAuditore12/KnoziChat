import { cn } from 'tailwind-variants';
import { Description } from 'heroui-native/description';
import { Surface, type SurfaceRootProps } from 'heroui-native/surface';
import { Activity } from 'react';
import { Avatar } from 'heroui-native/avatar';
import { View } from 'react-native';

import { ChatGroupWithUserDetails } from '@/features/chat/types/group-chats';

interface ChatGroupBubbleProps extends SurfaceRootProps {
  data: ChatGroupWithUserDetails;
}

export function ChatGroupBubble({ data, className, ...props }: ChatGroupBubbleProps) {
  const { mode, text, createdAt, senderName, senderAvatar } = data;

  return (
    <View className={cn('flex-row gap-x-1', mode === 'SENT' ? 'self-end' : 'self-start')}>
      <Activity mode={mode === 'RECEIVED' ? 'visible' : 'hidden'}>
        <Avatar className="self-f" alt="">
          <Avatar.Image source={senderAvatar ? { uri: senderAvatar } : undefined} />
          <Avatar.Fallback>{senderName[0]}</Avatar.Fallback>
        </Avatar>
      </Activity>
      <Surface
        className={cn(
          'my-1 max-w-xs rounded-xl p-3',
          mode === 'SENT' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
          className
        )}
        {...props}>
        <Activity mode={mode === 'RECEIVED' ? 'visible' : 'hidden'}>
          <Description className="font-bold text-orange-500">{senderName}</Description>
        </Activity>

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
    </View>
  );
}
