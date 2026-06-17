import { cn } from '@gluestack-ui/utils';
import { Activity, useState, type ComponentProps } from 'react';
import { Haptics } from 'react-native-nitro-haptics';
import { format } from '@bernagl/react-native-date';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

import { ChatDirectImage } from './image';
import { StatusIcon } from './status-icon';

import type { DirectChatWithAttachment } from '@/features/chat/types/direct-chats';

import { activeUploadControllers } from '@/lib/upload-manager';
import { sendMessageEvent } from '@/features/chat/direct/events/send-message';
import { useSocketState } from '@/store/socket';
import { PauseIcon } from './status-icon/icons/pauseIcon';
import { PlayIcon } from './status-icon/icons/playIcon';

interface ChatOneToOneBubbleProps extends ComponentProps<typeof Box> {
  data: DirectChatWithAttachment;
  receiverId: string;
  selected?: boolean;
  onPress?: ComponentProps<typeof Pressable>['onPress'];
  onLongPress?: ComponentProps<typeof Pressable>['onLongPress'];
  onPreviewMedia?: (id: string) => void;
}

export function ChatOneToOneBubble({
  data,
  receiverId,
  className,
  selected,
  onPress,
  onLongPress,
  onPreviewMedia,
  ...props
}: ChatOneToOneBubbleProps) {
  const { mode, content, createdAt, contentType, status, attachment } = data;
  const [isPressed, setIsPressed] = useState(false);

  const socket = useSocketState((state) => state.socket);

  const isSent = mode === 'SENT';
  const hasMedia = contentType === 'image' || contentType === 'video';
  const attachmentUri = [
    attachment?.remoteUrl,
    attachment?.localUri,
    attachment?.thumbnailUri,
  ].find((value): value is string => typeof value === 'string' && value.length > 0);
  const imageSource = attachmentUri ? { uri: attachmentUri } : undefined;
  const isUploadingOrPaused =
    attachment && ['UPLOADING', 'PAUSED'].includes(attachment.transferStatus);

  const handlePause = () => {
    const controller = activeUploadControllers.get(data.id);
    if (controller) {
      controller.abort();
    }
  };

  const handlePreview = () => {
    if (!attachmentUri) return;
    onPreviewMedia?.(data.id);
  };

  const handleResume = () => {
    if (!socket || !attachment || !attachment.localUri) return;

    sendMessageEvent({
      conversationId: data.conversationId,
      receiverId,
      socket,
      file: {
        uri: attachment.localUri,
        name: attachment.fileName ?? 'file',
        type: attachment.mimeType ?? 'application/octet-stream',
        size: attachment.totalBytes ?? 0,
        contentType: contentType as 'video' | 'image' | 'file',
      },
      content: content,
      isResume: true,
      messageId: data.id,
      deletedAt: undefined,
    });
  };

  return (
    <Box
      className={cn(
        'relative w-full flex-row px-2 py-1',
        isSent ? 'justify-end' : 'justify-start',
        selected && 'bg-emerald-500/20 dark:bg-emerald-400/20',
        isPressed && 'opacity-70'
      )}>
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
          'z-10 my-1 max-w-[80%] shrink overflow-hidden rounded-2xl p-3',
          isSent ? 'bg-emerald-600/95 dark:bg-emerald-500/90' : 'bg-gray-200 dark:bg-gray-700',
          hasMedia && 'p-1.5',
          className
        )}
        pointerEvents="box-none"
        {...props}>
        {/* MEDIA COMPONENTS */}
        <Activity mode={contentType === 'image' && attachmentUri ? 'visible' : 'hidden'}>
          <Pressable
            className="overflow-hidden rounded-xl"
            onPress={handlePreview}
            onLongPress={(e) => {
              Haptics.impact('rigid');
              onLongPress?.(e);
            }}>
            <Box pointerEvents="none">
              <ChatDirectImage source={imageSource} />
            </Box>
          </Pressable>
        </Activity>

        <Activity mode={contentType === 'video' && attachmentUri ? 'visible' : 'hidden'}>
          <Pressable
            className="relative overflow-hidden rounded-xl"
            onPress={handlePreview}
            onLongPress={(e) => {
              Haptics.impact('rigid');
              onLongPress?.(e);
            }}>
            <Box pointerEvents="none">
              <ChatDirectImage
                source={attachment?.thumbnailUri ? { uri: attachment.thumbnailUri } : imageSource}
              />
              <Box className="absolute inset-0 items-center justify-center bg-black/20">
                <Box className="items-center justify-center rounded-full bg-black/50 p-2 pl-3">
                  <PlayIcon size={20} color="#ffffff" />
                </Box>
              </Box>
            </Box>
          </Pressable>
        </Activity>

        {/* UPLOAD PROGRESS & CONTROLS UI */}
        <Activity
          mode={
            isUploadingOrPaused || attachment?.transferStatus === 'FAILED' ? 'visible' : 'hidden'
          }>
          <Box
            className={cn(
              'mt-2 rounded-xl p-3',
              isSent ? 'bg-black/20' : 'bg-black/5 dark:bg-white/10'
            )}
            pointerEvents="auto">
            <Text
              size="sm"
              className={isSent ? 'text-white' : 'text-neutral-800 dark:text-white'}
              numberOfLines={1}>
              {attachment?.fileName}
            </Text>

            <Activity mode={isUploadingOrPaused ? 'visible' : 'hidden'}>
              <Box className="mt-2 flex-row items-center justify-between">
                <Box className="mr-3 flex-1">
                  <Progress
                    value={
                      attachment?.totalBytes
                        ? ((attachment.transferredBytes ?? 0) / attachment.totalBytes) * 100
                        : 0
                    }
                    className="h-2 w-full bg-white/30">
                    <ProgressFilledTrack className={isSent ? 'bg-white' : 'bg-emerald-500'} />
                  </Progress>
                  <Text
                    size="xs"
                    className={cn('mt-1', isSent ? 'text-white/70' : 'text-neutral-500')}>
                    {((attachment?.transferredBytes ?? 0) / 1024 / 1024).toFixed(1)} /{' '}
                    {((attachment?.totalBytes ?? 0) / 1024 / 1024).toFixed(1)} MB
                  </Text>
                </Box>

                {/* 👇 Explicitly rendering the SVG components and passing color directly */}
                {attachment?.transferStatus === 'UPLOADING' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 rounded-full border-white/50 p-0"
                    onPress={handlePause}>
                    <PauseIcon size={14} color={isSent ? '#ffffff' : '#262626'} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white p-0"
                    onPress={handleResume}>
                    <PlayIcon
                      size={14}
                      color="#059669" // Tailwind emerald-600 hex
                    />
                  </Button>
                )}
              </Box>
            </Activity>

            <Activity mode={attachment?.transferStatus === 'FAILED' ? 'visible' : 'hidden'}>
              <Text size="xs" className="mt-2 font-bold text-red-300">
                Upload Failed. Tap resume to retry.
              </Text>
            </Activity>
          </Box>
        </Activity>

        {/* TEXT CONTENT */}
        <Activity mode={!!content ? 'visible' : 'hidden'}>
          <Text
            pointerEvents="none"
            className={cn(
              'text-[15px] leading-5',
              isSent ? 'text-white' : 'text-black dark:text-white',
              hasMedia && 'px-2 pt-2 pb-1'
            )}>
            {content}
          </Text>
        </Activity>

        {/* TIMESTAMPS & STATUS */}
        <Box
          className={cn('mt-1 flex-row items-center justify-end gap-1', hasMedia && 'px-2 pb-1')}
          pointerEvents="none">
          <Text className="text-[11px]" style={{ color: isSent ? '#d1fae5' : '#9ca3af' }}>
            {format(new Date(createdAt), 'hh:mm aa')}
          </Text>

          <Activity mode={isSent ? 'visible' : 'hidden'}>
            <StatusIcon status={status} color="#d1fae5" size={14} />
          </Activity>
        </Box>
      </Box>
    </Box>
  );
}
