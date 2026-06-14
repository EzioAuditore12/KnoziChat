import { View } from 'react-native';
import { cn } from '@gluestack-ui/utils';
import { Text } from '@/components/ui/text';
import { FormattedAiText } from '@/features/ai/components/formatted-ai-text';
import type { Ai } from '@/db/tables/ai.table';

interface AiChatBubbleProps {
  item: Ai;
  directChats?: any[];
  allUsers?: any[];
}

export function AiChatBubble({ item, directChats = [], allUsers = [] }: AiChatBubbleProps) {
  const isHuman = item.sender === 'human';

  return (
    <View
      className={cn(
        'mb-4 max-w-[85%] rounded-2xl p-4',
        isHuman
          ? 'self-end rounded-br-sm bg-blue-600'
          : 'self-start rounded-bl-sm border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
      )}>
      {isHuman ? (
        <Text className="text-base text-white">{item.text}</Text>
      ) : (
        <FormattedAiText
          text={item.text}
          directChats={directChats}
          allUsers={allUsers}
          className="text-base text-gray-800 dark:text-gray-100"
        />
      )}
    </View>
  );
}
