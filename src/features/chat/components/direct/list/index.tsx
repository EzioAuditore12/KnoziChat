import { cn } from '@gluestack-ui/utils';
import { Activity, useMemo, useRef, useState } from 'react';

import { FlashList, type FlashListRef } from '@shopify/flash-list';

import { type NativeScrollEvent, type NativeSyntheticEvent, View } from 'react-native';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, Icon } from '@/components/ui/icon';

import { ChatOneToOneBubble } from './chat-bubble';
import { DirectChatWithAttachment } from '@/features/chat/types/direct-chats';
import { VideoPlaybackContext } from './video-context';

interface ChatSection {
  date: string;

  data: DirectChatWithAttachment[];
}

interface FlattenedHeader {
  type: 'HEADER';

  id: string;

  title: string;
}

interface FlattenedMessage extends DirectChatWithAttachment {
  type: 'MESSAGE';
}

type FlattenedItem = FlattenedHeader | FlattenedMessage;

interface ChatDirectListProps {
  data: ChatSection[];

  className?: string;

  onStartReached?: () => void;

  selectedMessageIds: string[];

  onSelectionChange: (ids: string[]) => void;

  receiverId: string;
}

export function ChatDirectList({
  data,
  className,
  onStartReached,
  selectedMessageIds,
  receiverId,
  onSelectionChange,
}: ChatDirectListProps) {
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
    <VideoPlaybackContext.Provider value={{ playingUri, setPlayingUri }}>
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
              <ChatOneToOneBubble
                receiverId={receiverId}
                data={item}
                selected={selectedMessageIds.includes(item.id)}
                onPress={() => handlePress(item.id)}
                onLongPress={() => handleLongPress(item.id)}
              />
            );
          }}
        />

        <Activity mode={viewHeight < contentHeight && !isAtListEnd ? 'visible' : 'hidden'}>
          <Button
            variant="secondary"
            onPress={scrollToEnd}
            className="absolute right-2 bottom-2 rounded-full">
            <Icon as={ArrowDownIcon} size="xl" />
          </Button>
        </Activity>
      </View>
    </VideoPlaybackContext.Provider>
  );
}
