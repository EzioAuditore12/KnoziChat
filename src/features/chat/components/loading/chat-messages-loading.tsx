import { Box } from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';
import { VStack } from '@/components/ui/vstack';

export function ChatMessagesLoading() {
  return (
    <VStack className="flex-1 justify-end gap-4 p-4">
      <Box className="self-start">
        <Skeleton className="h-12 w-48 rounded-2xl rounded-bl-sm" />
      </Box>
      <Box className="self-end">
        <Skeleton className="h-12 w-40 rounded-2xl rounded-br-sm" />
      </Box>
      <Box className="self-end">
        <Skeleton className="h-16 w-56 rounded-2xl rounded-br-sm" />
      </Box>
      <Box className="flex-row items-end gap-2 self-start">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-12 w-32 rounded-2xl rounded-bl-sm" />
      </Box>
      <Box className="self-end">
        <Skeleton className="h-10 w-32 rounded-2xl rounded-br-sm" />
      </Box>
    </VStack>
  );
}
