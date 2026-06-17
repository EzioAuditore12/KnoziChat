import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';

import { Icon, ArrowRightIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Link } from '@/components/native-link';

import type { BaseChatMediaItem } from '@/features/chat/direct/components/media/media-section-list';

interface RecentMediaListProps<T extends BaseChatMediaItem> {
  id: string;
  media: T[] | undefined;
  type: 'direct' | 'group';
}

export function RecentMediaList<T extends BaseChatMediaItem>({
  id,
  media,
  type,
}: RecentMediaListProps<T>) {
  const mediaRoute = (
    type === 'direct' ? '/chat/direct/media/[id]' : '/chat/group/media/[id]'
  ) as any;

  return (
    <Box className="mt-4 px-5">
      <HStack className="mb-2 items-center justify-between">
        <Text className="text-lg font-semibold">Media</Text>
        <Link href={{ pathname: mediaRoute, params: { id } }} className="text-primary font-medium">
          View All
        </Link>
      </HStack>
      {media && media.length > 0 ? (
        <FlashList
          horizontal
          data={media}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <Box className="w-2" />}
          renderItem={({ item }) => (
            <Box className="h-20 w-20 overflow-hidden rounded-md bg-gray-200">
              <Image
                source={{ uri: item.thumbnailUri || item.localUri || item.remoteUrl || undefined }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </Box>
          )}
          ListFooterComponent={() => (
            <Link href={{ pathname: mediaRoute, params: { id } }}>
              <Box className="ml-2 h-20 w-20 items-center justify-center rounded-md">
                <Icon as={ArrowRightIcon} size="xl" className="text-gray-500" />
              </Box>
            </Link>
          )}
        />
      ) : (
        <Text className="text-gray-500">No media found</Text>
      )}
    </Box>
  );
}
