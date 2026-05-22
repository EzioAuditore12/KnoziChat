import { Ai } from '@/db/tables/ai.table';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { View } from 'react-native';
import { cn } from '@gluestack-ui/utils';
import { Text } from '@/components/ui/text';

interface AiChatListProps extends Omit<FlashListProps<Ai>, 'renderItem'> {
  data: Ai[];
}

export function AiChatList({ data, ...props }: AiChatListProps) {
  return (
    <FlashList
      data={data}
      contentContainerStyle={{ padding: 16 }}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const isHuman = item.sender === 'human';
        return (
          <View
            className={cn(
              'mb-4 max-w-[85%] rounded-2xl p-4',
              isHuman
                ? 'self-end rounded-br-sm bg-blue-600'
                : 'self-start rounded-bl-sm border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
            )}>
            <Text
              className={cn(
                'text-base',
                isHuman ? 'text-white' : 'text-gray-800 dark:text-gray-100'
              )}>
              {item.text}
            </Text>
          </View>
        );
      }}
      {...props}
    />
  );
}
