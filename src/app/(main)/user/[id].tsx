import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserProfile } from '@/features/common/components/user-profile';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { useGetUser } from '@/features/common/hooks/queries/use-get-user';

/*
import { useOptimisticUpdate } from '@/db/hooks/use-optimistic-update';

import { database } from '@/db';
import syncEngine from '@/db/sync';
import { useEffect } from 'react';
import { USER_TABLE_NAME } from '@/db/schemas/user-table.schema';
import { SyncOperation } from '@/db/types';
import { Collection, Q } from '@nozbe/watermelondb';
import { User } from '@/db/models/user.model';
*/

export default function UserDetails() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id } = useLocalSearchParams() as unknown as { id: string };

  const { data } = useGetUser(id);
  /*
  const { execute } = useOptimisticUpdate(database, syncEngine);
  useEffect(() => {
    if (!data) return;

    const saveUser = async () => {
      execute(USER_TABLE_NAME, SyncOperation.CREATE, async (collection: Collection<User>) => {

        const existing = await collection.query(Q.where('server_id', data.id)).fetch();

        if (existing.length > 0) {
          return existing[0].update((user) => {
            user.firstName = data.firstName;
            user.middleName = data.middleName;
            user.lastName = data.lastName;
            user.phoneNumber = data.phoneNumber;
            user.email = data.email;
            user.avatar = data.avatar;
            user.createdAt = new Date(data.createdAt);
            user.updatedAt = new Date(data.updatedAt);
          });
        }

        return collection.create((user) => {
          user.firstName = data.firstName;
          user.middleName = data.middleName;
          user.lastName = data.lastName;
          user.phoneNumber = data.phoneNumber;
          user.email = data.email;
          user.avatar = data.avatar;
          user.createdAt = new Date(data.createdAt);
          user.updatedAt = new Date(data.updatedAt);
        });
      });
    };

    saveUser();
  });*/

  if (!data)
    return (
      <ScrollView contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
        <Text variant={'h1'}>Not Found</Text>
      </ScrollView>
    );

  return (
    <ScrollView
      style={{ marginTop: safeAreaInsets.top }}
      contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
      <UserProfile className="w-full max-w-4xl" data={data} />

      <Button
        onPress={() =>
          router.push({
            pathname: '/(main)/new-chat/[id]',
            params: {
              id,
              name: data.firstName,
            },
          })
        }>
        <Text>Start Chatting</Text>
      </Button>
    </ScrollView>
  );
}
