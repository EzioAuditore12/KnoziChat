import { cn } from '@gluestack-ui/utils';
import { format, formatDistanceToNow } from 'date-fns';
import type { ComponentProps } from 'react';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

interface ChatGroupDetailsHeaderProps extends ComponentProps<typeof Box> {
  data: {
    name: string;
    membersLength: number;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  typingNames?: string[]; 
}

export function ChatGroupDetailsHeader({ className, data, ...props }: ChatGroupDetailsHeaderProps) {
  const { name, membersLength, avatar, createdAt, updatedAt } = data;

  return (
    <Box className={cn(className)} {...props}>
      <Avatar className="h-28 w-28 rounded-full">
        <AvatarImage
          source={
            avatar
              ? {
                  uri: avatar,
                }
              : undefined
          }
        />

        <AvatarFallbackText>{name?.[0] ?? 'G'}</AvatarFallbackText>
      </Avatar>

      <Text size="2xl" className="mt-4 font-bold">
        {name}
      </Text>

      <Text size="sm" className="mt-1 text-zinc-500">
        {membersLength} members
      </Text>

      <Box className="mt-6 w-full rounded-2xl p-4">
        <Text className="text-base font-semibold">Group Information</Text>

        <VStack className="mt-3 gap-y-2">
          <HStack className="items-center justify-between">
            <Text size="sm" className="text-zinc-500">
              Created
            </Text>

            <Text size="sm" className="font-medium">
              {format(createdAt, 'dd MMM yyyy')}
            </Text>
          </HStack>

          <HStack className="items-center justify-between">
            <Text size="sm" className="text-zinc-500">
              Last Updated
            </Text>

            <Text size="sm" className="font-medium">
              {formatDistanceToNow(updatedAt, {
                addSuffix: true,
              })}
            </Text>
          </HStack>
        </VStack>
      </Box>

      <VStack className="mt-4 w-full rounded-2xl p-4">
        <Text className="text-base font-semibold">Group Members</Text>

        <Text size="sm" className="mt-1 text-zinc-500">
          People participating in this group conversation
        </Text>
      </VStack>

      <Box className="h-4" />
    </Box>
  );
}
