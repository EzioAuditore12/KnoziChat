import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/store';

import { Link } from 'expo-router';

export default function HomeScreen() {
  const { user, logout } = useAuthStore((state) => state);
  return (
    <Box className="flex-1 items-center justify-center">
      <Text>{user?.firstName}</Text>
      <Link href={'/(auth)/login'}>Login</Link>

      <Link href={'/(app)/search'}>Search</Link>

      <Button className="bg-red-500" onPress={logout}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </Box>
  );
}
