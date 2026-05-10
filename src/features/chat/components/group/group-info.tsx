import { router } from 'expo-router';

import { Avatar } from 'heroui-native/avatar';
import { Description } from 'heroui-native/description';

import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from 'tailwind-variants';

import { useQuery } from '@powersync/react-native';
import { toCompilableQuery } from '@powersync/drizzle-driver';

import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';

import { conversationGroupTable } from '@/db/tables/conversation-group.table';
import { userTable } from '@/db/tables/user.table';

import { Ionicons } from '@/components/icon';
import { ThrottledTouchable } from '@/components/throttled-touchable';

const query = db
  .select({
    id: conversationGroupTable.id,
    name: conversationGroupTable.name,
    avatar: conversationGroupTable.avatar,

    members: sql<string>`
      (
        SELECT group_concat(${userTable.firstName}, ', ')
        FROM user
        WHERE EXISTS (
          SELECT 1
          FROM json_each(${conversationGroupTable.participantIds})
          WHERE json_each.value = user.id
        )
      )
    `.as('members'),
  })
  .from(conversationGroupTable);

interface GroupInfoProps extends ViewProps {
  id: string;
}

export function GroupInfo({ className, id, ...props }: GroupInfoProps) {
  const safeAreaInsets = useSafeAreaInsets();

  const { data, isLoading } = useQuery(
    toCompilableQuery(query.where(eq(conversationGroupTable.id, id)).limit(1))
  );

  if (isLoading || !data?.[0]) {
    return <Description>Data being loaded</Description>;
  }

  const group = data[0];

  return (
    <View
      key={group.id}
      className={cn(
        'justify border-background-tertiary flex-row items-center gap-x-3 border-b-2 p-2 px-4',
        className
      )}
      style={{ paddingTop: safeAreaInsets.top }}
      {...props}>
      <ThrottledTouchable className="bg-background rounded-full p-2" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} />
      </ThrottledTouchable>

      <ThrottledTouchable
        onPress={() =>
          router.push({
            pathname: '/(main)/chat-group/details/[id]',
            params: { id },
          })
        }>
        <Avatar alt={group.avatar ?? ''} className="size-14">
          <Avatar.Image
            source={
              group.avatar
                ? {
                    uri: group.avatar,
                  }
                : undefined
            }
          />

          <Avatar.Fallback>{group.name?.[0] ?? 'G'}</Avatar.Fallback>
        </Avatar>
      </ThrottledTouchable>

      <View className="flex-1">
        <Description numberOfLines={1} className="font-bold">
          {group.name}
        </Description>

        <Description numberOfLines={1} className="text-sm text-zinc-500">
          {group.members}
        </Description>
      </View>
    </View>
  );
}
