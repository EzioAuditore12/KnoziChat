import { cn } from '@gluestack-ui/utils';
import { format } from '@bernagl/react-native-date';
import type { ComponentProps } from 'react';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import type { User } from '../../schemas/user.schema';

interface UserProfileProps extends ComponentProps<typeof Box> {
  data?: User;
}

export function UserProfile({ className, data, ...props }: UserProfileProps) {
  if (!data) return null;

  const { avatar, createdAt, email, firstName, middleName, lastName, phoneNumber, id } = data;

  const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

  return (
    <Box key={id} className={cn('items-center rounded-3xl p-6', className)} {...props}>
      <VStack className="items-center gap-4">
        <Avatar className="h-48 w-48">
          <AvatarImage
            source={{
              uri: avatar ?? undefined,
            }}
          />
          <AvatarFallbackText>{firstName}</AvatarFallbackText>
        </Avatar>

        <VStack className="items-center gap-1">
          <Heading size="lg" className="text-center">
            {fullName}
          </Heading>

          <Text className="text-center">{email}</Text>

          <Text className="text-center">{phoneNumber}</Text>

          <Text className="mt-2 text-center text-sm">
            Joined {format(new Date(createdAt), 'dd MMM yyyy')}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
