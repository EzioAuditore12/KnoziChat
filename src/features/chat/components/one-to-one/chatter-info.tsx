import { Ionicons } from '@/components/icon';
import { ThrottledTouchable } from '@/components/throttled-touchable';
import { router } from 'expo-router';
import { Avatar } from 'heroui-native/avatar';
import { Description } from 'heroui-native/description';
import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from 'tailwind-variants';
import { useQuery } from '@powersync/react-native';
import { toCompilableQuery } from '@powersync/drizzle-driver';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { userTable } from '@/db/tables/user.table';

const query = db.select().from(userTable);

interface ChatterInfoProps extends ViewProps {
  userId: string;
}

export function ChatterInfo({ className, userId, ...props }: ChatterInfoProps) {
  const safeAreaInsets = useSafeAreaInsets();

  const { data, isLoading } = useQuery(
    toCompilableQuery(query.where(eq(userTable.id, userId)).limit(1))
  );

  if (isLoading) return <Description>Data being loaded</Description>;

  return (
    <View
      key={data[0].id}
      className={cn(
        'justify border-background-tertiary flex-row items-center gap-x-1 border-b-2 p-2 px-4',
        className
      )}
      style={{ paddingTop: safeAreaInsets.top }}
      {...props}>
      <ThrottledTouchable className="bg-background rounded-full p-2" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} />
      </ThrottledTouchable>

      <Avatar alt={data[0].firstName ?? ''} className="size-14">
        <Avatar.Image />
        <Avatar.Fallback>{data[0].firstName[0]}</Avatar.Fallback>
      </Avatar>

      <View className="flex-col">
        <View className="flex-row gap-x-2">
          <Description className="font-bold">
            {data[0].firstName} {data[0].lastName}
          </Description>
        </View>

        <Description>{data[0].phoneNumber}</Description>
      </View>
    </View>
  );
}
