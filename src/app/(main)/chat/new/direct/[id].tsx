import { Stack, useLocalSearchParams } from 'expo-router';

import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';

import { SendFirstMessage } from '@/features/chat/components/direct/send-first-message';
import { useInitializeDirectChat } from '@/features/chat/hooks/mutations/use-initialize-direct-chat';

export default function NewDirectChatScreen() {
  const { id, name } = useLocalSearchParams() as unknown as {
    id: string;
    name: string;
  };

  console.log(id);

  const { mutate, isPending } = useInitializeDirectChat();

  return (
    <>
      <Stack.Screen options={{ headerTitle: name }} />
      <Box className="flex-1">
        <Center className="flex-1">
          <Text className="text-center text-lg">Start a fresh new chat with ${name}</Text>
        </Center>
        <SendFirstMessage
          className="items-center"
          isPending={isPending}
          receiverId={id}
          handleSubmit={mutate}
        />
      </Box>
    </>
  );
}
