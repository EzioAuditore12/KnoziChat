import { View, type ViewProps } from 'react-native';
import { router } from 'expo-router';
import { cn } from '@gluestack-ui/utils';
import { Text } from '@/components/ui/text';

import { ThrottledTouchable } from '@/components/throttled-touchable';
import { ArrowLeftIcon, Icon, StarIcon } from '@/components/ui/icon';
import { GroupAvatar } from '@/features/ai/components/input/group-avatar';

interface AiHeaderProps extends ViewProps {
  name?: string;
  avatar?: string | null;
}

export function AiHeader({ name, avatar, className, ...props }: AiHeaderProps) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-x-3 border-b border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-black',
        className
      )}
      {...props}>
      <ThrottledTouchable
        onPress={() => router.back()}
        className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
        <Icon as={ArrowLeftIcon} className="text-xl text-black dark:text-white" />
      </ThrottledTouchable>

      {name ? (
        <View className="relative">
          <GroupAvatar
            name={name}
            avatar={avatar}
            className="h-10 w-10 shrink-0 bg-gray-100 dark:bg-gray-800"
          />
          <View className="absolute -right-1 -bottom-1 rounded-full border-2 border-white bg-linear-to-tr from-blue-400 via-purple-400 to-pink-400 p-0.5 dark:border-black">
            <Icon as={StarIcon} className="text-[10px] text-white" />
          </View>
        </View>
      ) : (
        <View className="mr-1 rounded-full bg-linear-to-tr from-blue-400 via-purple-400 to-pink-400 p-2">
          <Icon as={StarIcon} className="text-2xl text-white" />
        </View>
      )}

      <View>
        <Text className="text-xl font-bold text-black dark:text-white">
          {name ? name : 'Knozi AI'}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {name ? 'AI Assistant' : 'Your personal assistant'}
        </Text>
      </View>
    </View>
  );
}
