import { cn } from 'tailwind-variants';
import { FlashList, type FlashListProps, type FlashListRef } from '@shopify/flash-list';
import { useRef, Activity, useState } from 'react';
import { Button } from 'heroui-native/button';
import { type NativeScrollEvent, type NativeSyntheticEvent, View } from 'react-native';

import type { ChatGroupWithUserDetails } from '@/features/chat/types/group-chats';

import { ChatGroupBubble } from './chat-bubble';

import { Ionicons } from '@/components/icon';

interface ChatGroupListProps extends Omit<
  FlashListProps<ChatGroupWithUserDetails>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> {
  data: ChatGroupWithUserDetails[];
}

export function ChatGroupList({ data, className, ...props }: ChatGroupListProps) {
  const ref = useRef<FlashListRef<ChatGroupWithUserDetails> | null>(null);

  const [viewHeight, setViewHeight] = useState<number>(0);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isAtListEnd, setIsAtListEnd] = useState<boolean>(false);

  const scrollToEnd = () => {
    ref.current?.scrollToEnd({ animated: true });
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
      className={cn('relative flex-1 p-1', className)}
      onLayout={(e) => setViewHeight(e.nativeEvent.layout.height)}>
      <FlashList
        ref={ref}
        onScroll={handleScroll}
        onContentSizeChange={(_, h) => setContentHeight(h)}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatGroupBubble data={item} />}
        // Calculate initial index based on data length
        initialScrollIndex={data.length > 0 ? data.length - 1 : 0}
        onStartReachedThreshold={0.5}
        maintainVisibleContentPosition={{
          startRenderingFromBottom: true,
          animateAutoScrollToBottom: true,
          autoscrollToBottomThreshold: 0.1,
        }}
        {...props}
      />
      <Activity mode={viewHeight < contentHeight && !isAtListEnd ? 'visible' : 'hidden'}>
        <Button className="absolute right-0 bottom-2" variant="tertiary" onPress={scrollToEnd}>
          <Ionicons name="arrow-down" />
        </Button>
      </Activity>
    </View>
  );
}
