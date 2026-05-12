import { cn } from '@gluestack-ui/utils';
import type { ComponentProps } from 'react';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { ArrowLeftIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { User } from '@/db/tables/user.table';

interface ChatterInfoProps extends ComponentProps<typeof Box> {
  data: User;
  isLoading: boolean;
  onBack?: () => void;
  onPress?: ThrottledTouchableProps['onPress'];
}

export function ChatterInfo({
  className,
  data,
  isLoading,
  onPress,
  onBack,
  ...props
}: ChatterInfoProps) {
  if (isLoading)
    return (
      <Box>
        <Text>Loading user data</Text>
      </Box>
    );

  return (
    <Box
      key={data.id}
      className={cn(
        'justify border-background-tertiary flex-row items-center gap-x-1 border-b-2 p-2 px-4',
        className
      )}
      {...props}>
      <ThrottledTouchable className="bg-background rounded-full p-2" onPress={onBack}>
        <Icon as={ArrowLeftIcon} size="xl" />
      </ThrottledTouchable>

      <ThrottledTouchable onPress={onPress}>
        <Avatar className="size-14">
          <AvatarImage />
          <AvatarFallbackText>{data.firstName[0]}</AvatarFallbackText>
        </Avatar>
      </ThrottledTouchable>

      <VStack>
        <HStack className="gap-x-2">
          <Text className="font-bold">
            {data.firstName} {data.lastName}
          </Text>
        </HStack>

        <Text>{data.email}</Text>
      </VStack>
    </Box>
  );
}
