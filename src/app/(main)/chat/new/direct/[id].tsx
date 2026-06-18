import { Stack, useLocalSearchParams } from 'expo-router';

import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

import { SendFirstMessage } from '@/features/chat/direct/components/send-first-message';
import { useInitializeDirectChat } from '@/features/chat/direct/hooks/mutations/use-initialize-direct-chat';

export default function NewDirectChatScreen() {
  const { id, name, avatar, email } = useLocalSearchParams() as unknown as {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };

  const { mutate, isPending } = useInitializeDirectChat();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HStack space="md" className="items-center">
              <Avatar className="size-10">
                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                {avatar ? <AvatarImage source={{ uri: avatar }} /> : null}
              </Avatar>
              <VStack>
                <Text className="text-lg font-semibold">{name}</Text>
                <Text className="text-typography-500 text-xs">{email}</Text>
              </VStack>
            </HStack>
          ),
        }}
      />
      <Box className="flex-1">
        <Center className="flex-1">
          <Text className="text-center text-lg">Start a fresh new chat with {name}</Text>
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
