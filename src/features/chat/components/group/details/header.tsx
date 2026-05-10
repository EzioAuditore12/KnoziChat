import { Avatar } from 'heroui-native/avatar';
import { Description } from 'heroui-native/description';
import { Surface } from 'heroui-native/surface';
import { View, type ViewProps } from 'react-native';

import { cn } from 'tailwind-variants';

import { formatDistanceToNow, format } from 'date-fns';

interface ChatGroupDetailsHeaderProps extends ViewProps {
  data: {
    name: string;
    membersLength: number;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function ChatGroupDetailsHeader({ className, data, ...props }: ChatGroupDetailsHeaderProps) {
  const { name, membersLength, avatar, createdAt, updatedAt } = data;

  return (
    <View className={cn(className)} {...props}>
      <Avatar alt={name ?? 'Group'} className="h-28 w-28 rounded-full">
        <Avatar.Image
          source={
            avatar
              ? {
                  uri: avatar,
                }
              : undefined
          }
        />

        <Avatar.Fallback>{name?.[0] ?? 'G'}</Avatar.Fallback>
      </Avatar>

      <Description className="mt-4 text-2xl font-bold">{name}</Description>

      <Description className="mt-1 text-sm text-zinc-500">{membersLength} members</Description>

      <Surface className="mt-6 w-full rounded-2xl p-4">
        <Description className="text-base font-semibold">Group Information</Description>

        <View className="mt-3 gap-y-2">
          <View className="flex-row items-center justify-between">
            <Description className="text-sm text-zinc-500">Created</Description>

            <Description className="text-sm font-medium">
              {format(createdAt, 'dd MMM yyyy')}
            </Description>
          </View>

          <View className="flex-row items-center justify-between">
            <Description className="text-sm text-zinc-500">Last Updated</Description>

            <Description className="text-sm font-medium">
              {formatDistanceToNow(updatedAt, {
                addSuffix: true,
              })}
            </Description>
          </View>
        </View>
      </Surface>

      <Surface className="mt-4 w-full rounded-2xl p-4">
        <Description className="text-base font-semibold">Group Members</Description>

        <Description className="mt-1 text-sm text-zinc-500">
          People participating in this group conversation
        </Description>
      </Surface>

      <View className="h-4" />
    </View>
  );
}
