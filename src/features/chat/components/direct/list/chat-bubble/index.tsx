import { cn } from '@gluestack-ui/utils';
import { Activity, useState, type ComponentProps } from 'react';
import { Haptics } from 'react-native-nitro-haptics';

import { format } from '@bernagl/react-native-date';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';

import { ChatDirectVideo } from './video';
import { ChatDirectImage } from './image';
import { StatusIcon } from './status-icon';

import { DirectChatWithAttachment } from '@/features/chat/types/direct-chats';

interface ChatOneToOneBubbleProps extends ComponentProps<typeof Box> {
  data: DirectChatWithAttachment;
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
  const { mode, content, createdAt, contentType, status, attachment } = data;
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Box
      className={cn(
        'relative w-full flex-row px-2 py-1',
        mode === 'SENT' ? 'justify-end' : 'justify-start',
        selected && 'bg-blue-500/20 dark:bg-blue-400/20',
        isPressed && 'opacity-70'
      )}>
      {/* Background pressable to catch full row interactions without intercepting video touches */}
      <Pressable
        className="absolute inset-0 z-0"
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={onPress}
        onLongPress={(e) => {
          Haptics.impact('rigid');
          onLongPress?.(e);
        }}
      />

      <Box
        className={cn(
          'z-10 my-1 max-w-[80%] shrink rounded-xl p-3',
          mode === 'SENT' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
          className
        )}
        pointerEvents="box-none"
        {...props}>
        <Activity mode={contentType === 'image' ? 'visible' : 'hidden'}>
          <Box pointerEvents="none">
            <ChatDirectImage
              source={{
                uri: attachment?.remoteUrl ?? attachment?.localUri ?? undefined,
              }}
            />
          </Box>
        </Activity>

        <Activity mode={contentType === 'video' ? 'visible' : 'hidden'}>
          <Box className="overflow-hidden rounded-xl">
            <ChatDirectVideo uri={attachment?.remoteUrl ?? attachment?.localUri ?? ''} />
          </Box>
        </Activity>

        <Activity mode={!!content ? 'visible' : 'hidden'}>
          <Text
            pointerEvents="none"
            className={cn(
              mode === 'SENT' ? 'text-white' : 'text-black dark:text-white',
              (contentType === 'image' || contentType === 'video') && 'mt-2'
            )}>
            {content}
          </Text>
        </Activity>

        <Box className="mt-1 flex-row items-center justify-end gap-1" pointerEvents="none">
          <Text
            className="text-sm"
            style={{
              color: mode === 'SENT' ? '#dbeafe' : '#6b7280',
            }}>
            {format(new Date(createdAt), 'hh:mm aa')}
          </Text>
          <Activity mode={mode === 'SENT' ? 'visible' : 'hidden'}>
            <StatusIcon status={status} color="#dbeafe" size={14} />
          </Activity>
        </Box>
      </Box>
    </Box>
  );
}
