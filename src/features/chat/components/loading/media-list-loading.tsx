import { Box } from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';

export function MediaListLoading() {
  return (
    <Box className="flex-row flex-wrap gap-[1%] p-1">
      {Array.from({ length: 15 }).map((_, i) => (
        <Skeleton key={i} className="mb-[1%] h-28 w-[32.6%] rounded-sm" />
      ))}
    </Box>
  );
}
