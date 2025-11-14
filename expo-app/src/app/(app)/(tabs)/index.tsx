import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ConversationRepository } from '@/features/app/chat/repositories/conversation.repository';
import { UserRepository } from '@/features/app/user/repositories/user.repository';
import { useAuthStore } from '@/store';

import { Link } from 'expo-router';

async function getUsers() {
  const userRepository = new UserRepository();

  const users = await userRepository.get();

  console.log(users);
}

async function getConversations() {
  const conversationRepository = new ConversationRepository();

  const conversations =
    await conversationRepository.getConversationsWithUsers();

  console.log(conversations);
}

export default function HomeScreen() {
  const { user, logout } = useAuthStore((state) => state);
  return (
    <Box className="flex-1 items-center justify-center gap-y-2">
      <Text>{user?.firstName}</Text>
      <Link href={'/(auth)/login'}>Login</Link>
      <Link href={'/(app)/search'}>Search</Link>
      <Button className="bg-red-500" onPress={logout}>
        <ButtonText>Logout</ButtonText>
      </Button>

      <Button onPress={getConversations}>
        <ButtonText>Get Conversations</ButtonText>
      </Button>

      <Button onPress={getUsers}>
        <ButtonText>Get Users</ButtonText>
      </Button>
    </Box>
  );
}
