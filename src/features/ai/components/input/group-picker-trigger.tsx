import { Pressable, Text, View } from 'react-native';

import { cn } from '@gluestack-ui/utils';

import { ChevronDownIcon, Icon } from '@/components/ui/icon';

import { GroupAvatar } from './group-avatar';
import type { ChatOption } from './types';

interface GroupPickerTriggerProps {
  selectedChat?: ChatOption;
  isLoadingChats: boolean;
  placeholder: string;
  onPress: () => void;
}

export function GroupPickerTrigger({
  selectedChat,
  isLoadingChats,
  placeholder,
  onPress,
}: GroupPickerTriggerProps) {
  return (
    <Pressable
      onPress={onPress}
      className="min-h-12 flex-row items-center rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
      <View className="mr-3 flex-1 flex-row items-center gap-3 overflow-hidden">
        <GroupAvatar name={selectedChat?.name ?? 'C'} avatar={selectedChat?.avatar} />
        <View className="min-w-0 flex-1">
          <Text className="text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
            {selectedChat?.type === 'direct' ? 'Direct' : 'Group'}
          </Text>
          <Text
            numberOfLines={1}
            className={cn(
              'text-sm font-medium text-zinc-900 dark:text-zinc-50',
              isLoadingChats && 'text-zinc-500 dark:text-zinc-400'
            )}>
            {isLoadingChats ? 'Loading chats...' : (selectedChat?.name ?? placeholder)}
          </Text>
        </View>
      </View>
      <Icon as={ChevronDownIcon} className="mr-0 h-4 w-4 text-zinc-400" />
    </Pressable>
  );
}
