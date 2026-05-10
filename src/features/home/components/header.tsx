import { View, type ViewProps } from 'react-native';
import { Button } from 'heroui-native/button';
import { router } from 'expo-router';
import { cn } from 'tailwind-variants';
import { Avatar } from 'heroui-native/avatar';

import { Link } from '@/components/link';
import { ThrottledTouchable } from '@/components/throttled-touchable';

import { useAuthStore } from '@/store/auth';

import { syncDatabase } from '@/db/sync';

export function Header({ className, ...props }: ViewProps) {
  const { user } = useAuthStore((state) => state);
  return (
    <View className={cn('flex-row items-center', className)} {...props}>
      <Link href={'/search'}>Search</Link>

      <ThrottledTouchable onPress={() => router.push('/settings')} className="ml-auto">
        <Avatar className="size-14" alt={user?.firstName ?? ''}>
          <Avatar.Image source={user?.avatar ? { uri: user.avatar } : undefined} />
          <Avatar.Fallback>{user?.firstName[0]}</Avatar.Fallback>
        </Avatar>
      </ThrottledTouchable>

      <Button onPress={() => router.push('/(main)/new-chat-group')}>Create Group</Button>
    </View>
  );
}
