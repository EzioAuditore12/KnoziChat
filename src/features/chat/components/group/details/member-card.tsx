import { Avatar } from 'heroui-native/avatar';
import { Chip } from 'heroui-native/chip';
import { Description } from 'heroui-native/description';
import { Surface, type SurfaceRootProps } from 'heroui-native/surface';
import { Activity } from 'react';
import { View } from 'react-native';
import { cn } from 'tailwind-variants';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

interface GroupMemberCardProps extends SurfaceRootProps {
  data: {
    name: string;
    isAdmin: boolean;
    isMe: boolean;
  };
  onPress?: ThrottledTouchableProps['onPress'];
}

export function GroupMemberCard({ className, data, onPress, ...props }: GroupMemberCardProps) {
  const { name, isAdmin, isMe } = data;
  return (
    <ThrottledTouchable onPress={isMe ? undefined : onPress}>
      <Surface
        className={cn('flex-row items-center justify-between rounded-2xl p-3', className)}
        {...props}>
        <View className="flex-row items-center gap-x-3">
          <Avatar alt={name}>
            <Avatar.Image />

            <Avatar.Fallback>{name[0]}</Avatar.Fallback>
          </Avatar>

          <View>
            <View className="flex-row items-center gap-x-2">
              <Description className="text-base font-semibold">{name}</Description>

              <Activity mode={isAdmin ? 'visible' : 'hidden'}>
                <Chip variant="soft">
                  <Chip.Label>Admin</Chip.Label>
                </Chip>
              </Activity>
            </View>

            <Description className="text-sm text-zinc-500">{isMe ? 'You' : 'Member'}</Description>
          </View>
        </View>
      </Surface>
    </ThrottledTouchable>
  );
}
