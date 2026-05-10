import { useMemo, useRef, useState, Activity } from 'react';

import { FlashList, type FlashListRef } from '@shopify/flash-list';

import { type NativeScrollEvent, type NativeSyntheticEvent, Text, View } from 'react-native';

import { Button } from 'heroui-native/button';

import { cn } from 'tailwind-variants';

import type { ChatOneToOne } from '@/db/tables/chat-one-to-one.table';

import { ChatOneToOneBubble } from './chat-one-to-one-bubble';

import { Ionicons } from '@/components/icon';
import { Chip } from 'heroui-native/chip';

interface ChatSection {
  date: string;

  data: ChatOneToOne[];
}

interface FlattenedHeader {
  type: 'HEADER';

  id: string;

  title: string;
}

interface FlattenedMessage extends ChatOneToOne {
  type: 'MESSAGE';
}

type FlattenedItem = FlattenedHeader | FlattenedMessage;

interface ChatOneToOneListProps {
  data: ChatSection[];

  className?: string;

  onStartReached?: () => void;
}

export function ChatOneToOneList({ data, className, onStartReached }: ChatOneToOneListProps) {
  const ref = useRef<FlashListRef<FlattenedItem> | null>(null);

  const [viewHeight, setViewHeight] = useState(0);

  const [contentHeight, setContentHeight] = useState(0);

  const [isAtListEnd, setIsAtListEnd] = useState(true);

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
              <Chip className="mx-auto my-4 bg-neutral-300/70 px-3 dark:bg-neutral-700/70">
                <Chip.Label className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  {item.title}
                </Chip.Label>
              </Chip>
            );
          }

          return <ChatOneToOneBubble data={item} />;
        }}
      />

      <Activity mode={viewHeight < contentHeight && !isAtListEnd ? 'visible' : 'hidden'}>
        <Button
          variant="tertiary"
          onPress={scrollToEnd}
          className="absolute right-2 bottom-2 rounded-full">
          <Ionicons name="arrow-down" className="text-xl" />
        </Button>
      </Activity>
    </View>
  );
}
