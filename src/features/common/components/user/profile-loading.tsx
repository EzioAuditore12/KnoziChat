import type { ComponentProps } from 'react';

import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Skeleton } from '@/components/ui/skeleton';
import { VStack } from '@/components/ui/vstack';

export function UserProfileLoading({ className, ...props }: ComponentProps<typeof Box>) {
  return (
    <Box className={className} {...props}>
      <Card className="p-4">
        <VStack className="gap-4">
          {/* Header */}
          <HStack className="items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />

            <VStack className="flex-1 gap-2">
              <Skeleton className="h-3 w-32 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </VStack>
          </HStack>

          {/* Content */}
          <VStack className="gap-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </VStack>

          {/* Image */}
          <Skeleton className="h-48 w-full rounded-xl" />
        </VStack>
      </Card>
    </Box>
  );
}
