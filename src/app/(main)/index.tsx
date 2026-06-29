import { Button } from 'heroui-native/button';
import { Typography } from 'heroui-native/text';
import { View } from 'react-native';

import { db } from '@/db';
import { useLiveQuery } from '@/db/hooks/use-live-query';
import { userRepository } from '@/db/repositories/user.repository';
import { userTable } from '@/db/tables/user.table';
import { useAuthStore } from '@/store/auth';

export default function HomeScreen() {
  const { data } = useLiveQuery(db.select().from(userTable));
  const { logout } = useAuthStore();

  console.log(data);

  return (
    <View className="flex-1 items-center justify-center">
      <Typography.Heading type="h2">Hello Home Screen</Typography.Heading>

      <Button
        onPress={() => {
          const randomId = Math.random().toString(36).substring(7);
          userRepository.create({
            email: `user_${randomId}@example.com`,
            username: `user_${randomId}`,
            firstName: 'Random',
            lastName: 'User',
          });
        }}
      >
        Create User
      </Button>

      <Button onPress={logout} variant="danger">
        Logout
      </Button>
    </View>
  );
}
