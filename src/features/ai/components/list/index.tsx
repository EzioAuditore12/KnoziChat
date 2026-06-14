import { Activity, useMemo, useRef, useState } from 'react';
import { View, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { cn } from '@gluestack-ui/utils';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, Icon } from '@/components/ui/icon';

import { AiChatBubble } from './chat-bubble';
import type { Ai } from '@/db/tables/ai.table';

interface AiChatSection {
  date: string;
  data: Ai[];
}

interface FlattenedHeader {
  type: 'HEADER';
  id: string;
  title: string;
}

interface FlattenedMessage extends Ai {
  type: 'MESSAGE';
}

type FlattenedItem = FlattenedHeader | FlattenedMessage;

interface AiChatListProps {
  data: AiChatSection[];
  directChats?: any[];
  allUsers?: any[];
  className?: string;
  onStartReached?: () => void;
}

export function AiChatList({
  data,
  directChats,
  allUsers,
  className,
  onStartReached,
}: AiChatListProps) {
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
        contentContainerStyle={{ paddingHorizontal: 16 }}
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

          return <AiChatBubble item={item} directChats={directChats} allUsers={allUsers} />;
        }}
      />

      <Activity mode={viewHeight < contentHeight && !isAtListEnd ? 'visible' : 'hidden'}>
        <Button
          variant="secondary"
          onPress={scrollToEnd}
          className="absolute right-4 bottom-2 h-10 w-10 rounded-full p-0">
          <Icon as={ArrowDownIcon} size="md" />
        </Button>
      </Activity>
    </View>
  );
}
