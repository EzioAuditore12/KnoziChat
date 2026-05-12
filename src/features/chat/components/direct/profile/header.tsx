import { cn } from '@gluestack-ui/utils';
import type { ComponentProps } from 'react';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

interface ChatProfileHeaderProps extends ComponentProps<typeof Box> {
  data: {
    avatar?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    commonGroupsLength: number;
  };
}

export function ChatProfileHeader({ data, className, ...props }: ChatProfileHeaderProps) {
  return (
    <Box className={cn(className)} {...props}>
      <Avatar className="size-32">
        <AvatarImage
          source={
            data.avatar
              ? {
                  uri: data.avatar,
                }
              : undefined
          }
        />

        <AvatarFallbackText>{data.firstName?.[0] ?? '?'}</AvatarFallbackText>
      </Avatar>

      <Text size="3xl" className="mt-5 font-bold">
        {data.firstName} {data.lastName}
      </Text>

      <Box className="mt-6 rounded-3xl border border-neutral-200 bg-neutral-100 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <Text size="sm" className="font-semibold">
          {data.commonGroupsLength} Common Groups
        </Text>
      </Box>

      <Text size="lg" className="mt-8 self-start font-semibold">
        Groups In Common
      </Text>
    </Box>
  );
}
