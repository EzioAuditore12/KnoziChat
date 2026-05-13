import { Activity, type ComponentProps } from 'react';
import { cn } from '@gluestack-ui/utils';

import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { User } from '@/db/tables/user.table';

export interface UserAvatarProps extends ComponentProps<typeof VStack> {
  data: User & { isOnline: boolean };
}

export const UserAvatar = ({ className, data, ...props }: UserAvatarProps) => {
  const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');

  return (
    <VStack className={cn(className)} {...props}>
      <Avatar className="size-20">
        <AvatarImage
          source={{
            uri: data.avatar ?? undefined,
          }}
          alt={fullName}
        />

        <AvatarFallbackText>{data.firstName}</AvatarFallbackText>

        <Activity mode={data.isOnline ? 'visible' : 'hidden'}>
          <AvatarBadge />
        </Activity>
      </Avatar>
      <Text size="xs" className="mt-1 max-w-20" numberOfLines={1}>
        {fullName}
      </Text>
    </VStack>
  );
};
