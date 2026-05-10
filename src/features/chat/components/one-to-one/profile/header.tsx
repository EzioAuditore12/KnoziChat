import { Avatar } from 'heroui-native/avatar';
import { Text } from 'react-native';
import { View, type ViewProps } from 'react-native';
import { cn } from 'tailwind-variants';

interface ChatProfileHeaderProps extends ViewProps {
  data: {
    avatar?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    commonGroupsLength: number;
  };
}

export function ChatProfileHeader({ data, className, ...props }: ChatProfileHeaderProps) {
  return (
    <View className={cn(className)} {...props}>
      <Avatar className="size-32" alt={data.firstName ?? ''}>
        <Avatar.Image
          source={
            data.avatar
              ? {
                  uri: data.avatar,
                }
              : undefined
          }
        />

        <Avatar.Fallback>{data.firstName?.[0] ?? '?'}</Avatar.Fallback>
      </Avatar>

      <Text className="mt-5 text-3xl font-bold text-black dark:text-white">
        {data.firstName} {data.lastName}
      </Text>

      <View className="mt-6 rounded-3xl border border-neutral-200 bg-neutral-100 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <Text className="text-sm font-semibold text-black dark:text-white">
          {data.commonGroupsLength} Common Groups
        </Text>
      </View>

      <Text className="mt-8 self-start text-lg font-semibold text-black dark:text-white">
        Groups In Common
      </Text>
    </View>
  );
}
