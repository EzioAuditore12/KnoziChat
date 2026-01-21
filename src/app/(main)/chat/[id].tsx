import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { EnhancedDirectChatList } from '@/features/chat/components/direct-chat-list';
import { SendDirectMessage } from '@/features/chat/components/send-direct-message';

export default function ChattingScreen() {
  const { id } = useLocalSearchParams() as unknown as { id: string };

  return (
    <>
      <Stack.Screen options={{ headerTitle: id, animation: 'none' }} />
      <View className="flex-1">
        <EnhancedDirectChatList conversationId={id} />
        <SendDirectMessage
          conversationId={id}
          className="items-center"
          handleSubmit={() => console.log('submitted')}
        />
      </View>
    </>
  );
}
