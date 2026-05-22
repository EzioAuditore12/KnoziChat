import { Pressable, Text, View } from 'react-native';

import { cn } from '@gluestack-ui/utils';

import { GroupAvatar } from './group-avatar';
import type { GroupOption } from './types';

interface GroupPickerOptionProps {
  group: GroupOption;
  isSelected: boolean;
  onPress: () => void;
}

export function GroupPickerOption({ group, isSelected, onPress }: GroupPickerOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 rounded-xl border px-3 py-3',
        isSelected
          ? 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30'
          : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'
      )}>
      <GroupAvatar name={group.name} avatar={group.avatar} />
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-medium text-zinc-900 dark:text-zinc-50" numberOfLines={1}>
          {group.name}
        </Text>
        <Text className="text-xs text-zinc-500 dark:text-zinc-400">Tap to select</Text>
      </View>
      {isSelected ? <Text className="text-xs font-semibold text-blue-600">Selected</Text> : null}
    </Pressable>
  );
}
