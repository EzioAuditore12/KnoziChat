import { cn } from '@gluestack-ui/utils';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { openPreview } from '@baronha/react-native-multiple-image-picker';
import { Activity, useMemo, useRef, useState } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent, View } from 'react-native';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonIcon } from '@/components/ui/button';
import { ArrowDownIcon } from '@/components/ui/icon';

import type { ChatGroupWithUserDetails } from '@/features/chat/types/group-chats';

import { ChatGroupBubble } from './chat-bubble';
import { GroupChatVideoPlaybackContext } from './video-context';

interface ChatGroupSection {
  date: string;

  data: ChatGroupWithUserDetails[];
}

interface FlattenedHeader {
  type: 'HEADER';

  id: string;

  title: string;
}

interface FlattenedMessage extends ChatGroupWithUserDetails {
  type: 'MESSAGE';
}

type FlattenedItem = FlattenedHeader | FlattenedMessage;

interface ChatGroupListProps {
  data: ChatGroupSection[];

  className?: string;

  onStartReached?: () => void;

  selectedMessageIds: string[];

  onSelectionChange: (ids: string[]) => void;
}

export function ChatGroupList({
  data,
  className,
  onStartReached,
  selectedMessageIds,
  onSelectionChange,
}: ChatGroupListProps) {
  const ref = useRef<FlashListRef<FlattenedItem> | null>(null);

  const [viewHeight, setViewHeight] = useState(0);

  const [contentHeight, setContentHeight] = useState(0);

  const [isAtListEnd, setIsAtListEnd] = useState(true);
  const [playingUri, setPlayingUri] = useState<string | null>(null);

  const isSelectionMode = selectedMessageIds.length > 0;

  const handlePress = (id: string) => {
    if (isSelectionMode) {
      onSelectionChange(
        selectedMessageIds.includes(id)
          ? selectedMessageIds.filter((msgId) => msgId !== id)
          : [...selectedMessageIds, id]
      );
    }
  };

  const handleLongPress = (id: string) => {
    if (!isSelectionMode) {
      onSelectionChange([id]);
    } else {
      onSelectionChange(
        selectedMessageIds.includes(id)
          ? selectedMessageIds.filter((msgId) => msgId !== id)
          : [...selectedMessageIds, id]
      );
    }
  };

  const flattenedData = useMemo(() => {
    return data.flatMap((section) => [
      {
        type: 'HEADER' as const,
        id: `header-${section.date}`,
        title: section.date,
      },

      ...section.data.map(
        (message): FlattenedMessage => ({
          type: 'MESSAGE',
          ...message,
        })
      ),
    ]);
  }, [data]);

  const mediaData = useMemo(() => {
    const items: any[] = [];
    const idToIndex: Record<string, number> = {};

    flattenedData.forEach((item) => {
      if (
        item.type === 'MESSAGE' &&
        (item.contentType === 'image' || item.contentType === 'video')
      ) {
        const attachmentUri = [
          item.attachment?.remoteUrl,
          item.attachment?.localUri,
          item.attachment?.thumbnailUri,
        ].find((value): value is string => typeof value === 'string' && value.length > 0);

        if (attachmentUri) {
          idToIndex[item.id] = items.length;
          items.push({
            path: attachmentUri,
            type: item.contentType,
            ...(item.contentType === 'video' && item.attachment?.thumbnailUri
              ? { thumbnail: item.attachment.thumbnailUri }
              : {}),
          });
        }
      }
    });

    return { items, idToIndex };
  }, [flattenedData]);

  const handlePreviewMedia = (id: string) => {
    const index = mediaData.idToIndex[id];
    if (index !== undefined) {
      openPreview(mediaData.items, index, { language: 'system' });
    }
  };

  const scrollToEnd = () => {
    ref.current?.scrollToEnd({
      animated: true,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    const paddingToBottom = 20;

    const atBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - paddingToBottom;

    setIsAtListEnd(atBottom);
  };

  return (
    <GroupChatVideoPlaybackContext value={{ playingUri, setPlayingUri }}>
      <View
        className={cn('relative flex-1', className)}
        onLayout={(e) => setViewHeight(e.nativeEvent.layout.height)}>
        <FlashList
          ref={ref}
          data={flattenedData}
          keyExtractor={(item) => item.id}
          onScroll={handleScroll}
          onStartReached={onStartReached}
          onStartReachedThreshold={0.5}
          onContentSizeChange={(_, h) => setContentHeight(h)}
          maintainVisibleContentPosition={{
            startRenderingFromBottom: true,
            animateAutoScrollToBottom: true,
            autoscrollToBottomThreshold: 0.1,
          }}
          renderItem={({ item }) => {
            if (item.type === 'HEADER') {
              return (
                <Badge className="mx-auto my-4 bg-neutral-300/70 px-3 dark:bg-neutral-700/70">
                  <BadgeText className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                    {item.title}
                  </BadgeText>
                </Badge>
              );
            }

            return (
              <ChatGroupBubble
                data={item}
                selected={selectedMessageIds.includes(item.id)}
                onPress={() => handlePress(item.id)}
                onLongPress={() => handleLongPress(item.id)}
                onPreviewMedia={handlePreviewMedia}
              />
            );
          }}
        />

        <Activity mode={viewHeight < contentHeight && !isAtListEnd ? 'visible' : 'hidden'}>
          <Button
            variant="secondary"
            onPress={scrollToEnd}
            className="absolute right-2 bottom-2 rounded-full">
            <ButtonIcon as={ArrowDownIcon} />
          </Button>
        </Activity>
      </View>
    </GroupChatVideoPlaybackContext>
  );
}
