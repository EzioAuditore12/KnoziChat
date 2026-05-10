import { Avatar } from 'heroui-native/avatar';
import { Text } from 'react-native';
import { View, type ViewProps } from 'react-native';
import { cn } from 'tailwind-variants';

import { ThrottledTouchable, ThrottledTouchableProps } from '@/components/throttled-touchable';

interface CommonGroupCardProps extends ViewProps {
  data: {
    id: string;
    name: string;
    avatar?: string | null;
  };

  onPress?: ThrottledTouchableProps['onPress'];
}

export function CommonGroupCard({ data, onPress, className, ...props }: CommonGroupCardProps) {
  return (
    <ThrottledTouchable
      onPress={onPress}
      className={cn(
        'flex-row items-center rounded-3xl border border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950',
        className
      )}
      {...props}>
      <Avatar className="size-14" alt={data.name}>
        <Avatar.Image
          source={
            data.avatar
              ? {
                  uri: data.avatar,
                }
              : undefined
          }
        />

        <Avatar.Fallback>{data.name[0]}</Avatar.Fallback>
      </Avatar>

      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-black dark:text-white">{data.name}</Text>

        <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Tap to view group
        </Text>
      </View>
    </ThrottledTouchable>
  );
}
