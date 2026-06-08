import { cn } from '@gluestack-ui/utils';
import { Activity, useMemo, useState, type ComponentProps } from 'react';
import { Haptics } from 'react-native-nitro-haptics';

import { format } from '@bernagl/react-native-date';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';

import type { ChatGroupWithUserDetails } from '@/features/chat/types/group-chats';

import { ChatGroupImage } from './image';
import { PlayIcon } from './status-icon/icons/playIcon';

interface ChatGroupBubbleProps extends ComponentProps<typeof Box> {
  data: ChatGroupWithUserDetails;

  selected?: boolean;

  onPress?: ComponentProps<typeof Pressable>['onPress'];

  onLongPress?: ComponentProps<typeof Pressable>['onLongPress'];

  onPreviewMedia?: (id: string) => void;
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

function getSystemMessage(data: ChatGroupWithUserDetails) {
  switch (data.systemEventType) {
    case 'member_left':
      return `${data.senderName} left the group`;

    case 'member_joined':
      return `${data.senderName} joined the group`;

    case 'admin_changed':
      return `${data.senderName} became admin`;

    case 'group_created':
      return `${data.senderName} created the group`;

    case 'group_name_changed':
      return 'Group name was changed';

    case 'group_avatar_changed':
      return 'Group avatar was changed';

    default:
      return 'System event';
  }
}

export function ChatGroupBubble({
  data,
  className,
  selected,
  onPress,
  onLongPress,
  onPreviewMedia,
  ...props
}: ChatGroupBubbleProps) {
  const { mode, content, createdAt, senderName, senderAvatar, contentType, attachment } = data;

  const [isPressed, setIsPressed] = useState(false);

  const safeSenderName = senderName ?? 'Unknown';

  const userColor = getUserBubbleColor(safeSenderName);

  const senderInitial = safeSenderName[0] ?? '?';

  const isSent = mode === 'SENT';
  const isSystem = contentType === 'system';

  const hasMedia = contentType === 'image' || contentType === 'video';
  const attachmentUri = [
    attachment?.remoteUrl,
    attachment?.localUri,
    attachment?.thumbnailUri,
  ].find((value): value is string => typeof value === 'string' && value.length > 0);
  const imageSource = attachmentUri ? { uri: attachmentUri } : undefined;

  const transferBytes = attachment?.transferredBytes ?? 0;
  const totalBytes = attachment?.totalBytes ?? 0;
  const isUploadingOrPaused = attachment
    ? ['UPLOADING', 'PAUSED'].includes(attachment.transferStatus)
    : false;
  const shouldShowAttachmentDetails =
    contentType === 'file' ||
    (attachment ? isUploadingOrPaused || attachment.transferStatus === 'FAILED' : false);

  const handlePreview = () => {
    if (!attachmentUri) return;
    onPreviewMedia?.(data.id);
  };

  const systemMessage = useMemo(() => getSystemMessage(data), [data]);

  if (isSystem) {
    return (
      <Box className="my-2 items-center px-4">
        <Box className="rounded-full bg-neutral-200 px-4 py-2 dark:bg-neutral-800">
          <Text className="text-center text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
            {systemMessage}
          </Text>

          <Text className="mt-1 text-center text-[10px] text-neutral-500">
            {format(new Date(createdAt), 'hh:mm aa')}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className={cn(
        'relative w-full flex-row gap-x-2 px-2 py-1',

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

      <Activity mode={!isSent ? 'visible' : 'hidden'}>
        <Avatar className="mt-1">
          <AvatarImage
            source={
              senderAvatar
                ? {
                    uri: senderAvatar,
                  }
                : undefined
            }
          />

          <AvatarFallbackText>{senderInitial}</AvatarFallbackText>
        </Avatar>
      </Activity>

      <Box
        className={cn(
          'z-10 my-1 max-w-[80%] shrink rounded-2xl p-3',

          isSent ? 'bg-emerald-600/95 dark:bg-emerald-500/90' : userColor,

          hasMedia && 'overflow-hidden p-1.5',

          className
        )}
        pointerEvents="box-none"
        {...props}>
        <Activity mode={!isSent ? 'visible' : 'hidden'}>
          <Text className="mb-1 text-[13px] font-semibold text-white/90">{safeSenderName}</Text>
        </Activity>

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
              <ChatGroupImage source={imageSource} />
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
              <ChatGroupImage
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

        <Activity mode={shouldShowAttachmentDetails ? 'visible' : 'hidden'}>
          <Box
            className={cn(
              'mt-2 rounded-xl p-3',
              isSent ? 'bg-black/20' : 'bg-black/5 dark:bg-white/10'
            )}>
            <Text
              size="sm"
              className={isSent ? 'text-white' : 'text-neutral-800 dark:text-white'}
              numberOfLines={1}>
              {attachment?.fileName ?? 'Attachment'}
            </Text>

            {isUploadingOrPaused && (
              <Box className="mt-2">
                <Progress
                  value={totalBytes ? (transferBytes / totalBytes) * 100 : 0}
                  className="h-2 w-full bg-white/30">
                  <ProgressFilledTrack className={isSent ? 'bg-white' : 'bg-emerald-500'} />
                </Progress>

                <Text
                  size="xs"
                  className={cn('mt-1', isSent ? 'text-white/70' : 'text-neutral-500')}>
                  {(transferBytes / 1024 / 1024).toFixed(1)} /{' '}
                  {(totalBytes / 1024 / 1024).toFixed(1)} MB
                </Text>
              </Box>
            )}

            {attachment?.transferStatus === 'FAILED' && (
              <Text size="xs" className="mt-2 font-bold text-red-300">
                Upload Failed.
              </Text>
            )}
          </Box>
        </Activity>

        {!!content && (
          <Text className={cn('text-[15px] leading-5 text-white', hasMedia && 'px-2 pt-2 pb-1')}>
            {content}
          </Text>
        )}

        <Box className={cn('mt-1 flex-row justify-end', hasMedia && 'px-2 pb-1')}>
          <Text className="text-[11px] text-white/70">
            {format(new Date(createdAt), 'hh:mm aa')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
