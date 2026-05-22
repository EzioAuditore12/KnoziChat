import { View, type ViewProps } from 'react-native';
import { router } from 'expo-router';
import { cn } from '@gluestack-ui/utils';
import { Text } from '@/components/ui/text';

import { ThrottledTouchable } from '@/components/throttled-touchable';
import { ArrowLeftIcon, Icon, StarIcon } from '@/components/ui/icon';

export default function AiHeader({ className, ...props }: ViewProps) {
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

      {/* AI Icon */}
      <View className="mr-1 rounded-full bg-linear-to-tr from-blue-400 via-purple-400 to-pink-400 p-2">
        <Icon as={StarIcon} className="text-2xl text-white" />
      </View>

      <View>
        <Text className="text-xl font-bold text-black dark:text-white">Knozi AI</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">Your personal assistant</Text>
      </View>
    </View>
  );
}
