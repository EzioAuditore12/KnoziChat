import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Description } from 'heroui-native/description';

import { SendFirstMessage } from '@/features/chat/components/send-first-message';
import { useInitializeDirectChat } from '@/features/chat/hooks/mutations/use-initialize-direct-chat';

export default function NewDirectChatScreen() {
  const { id, name } = useLocalSearchParams() as unknown as {
    id: string;
    name: string;
  };

  const { mutate, isPending } = useInitializeDirectChat();

  return (
    <>
      <Stack.Screen options={{ headerTitle: name }} />
      <View className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Description className="text-center text-lg">
            Start a fresh new chat with ${name}
          </Description>
        </View>
        <SendFirstMessage
          className="items-center"
          isPending={isPending}
          receiverId={id}
          handleSubmit={mutate}
        />
      </View>
    </>
  );
}
