import { View, Text } from 'react-native';
import { Activity } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { FormattedAiText } from '@/features/ai/components/formatted-ai-text';

interface AiStreamingIndicatorProps {
  isPending: boolean;
  streamingText: string;
  directChats?: any[];
  allUsers?: any[];
}

export function AiStreamingIndicator({
  isPending,
  streamingText,
  directChats,
  allUsers,
}: AiStreamingIndicatorProps) {
  return (
    <Activity mode={isPending ? 'visible' : 'hidden'}>
      <View className="flex-row items-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        {isPending && !streamingText && <Spinner size="small" />}
        <View className="flex-1">
          {streamingText ? (
            <FormattedAiText
              text={streamingText}
              directChats={directChats}
              allUsers={allUsers}
              className="text-sm text-gray-500"
            />
          ) : (
            <Text className="text-sm text-gray-500 italic">Knozi AI is thinking...</Text>
          )}
        </View>
      </View>
    </Activity>
  );
}
