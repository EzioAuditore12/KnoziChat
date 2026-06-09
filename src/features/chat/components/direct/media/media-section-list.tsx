import { useMemo } from 'react';
import { Dimensions, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { openPreview } from '@baronha/react-native-multiple-image-picker';
import { Image } from 'expo-image';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

export interface BaseChatMediaItem {
  id: string;
  contentType: string;
  remoteUrl?: string | null;
  localUri?: string | null;
  thumbnailUri?: string | null;
}

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 4;
const SPACING = 2;
const ITEM_SIZE = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

interface MediaSectionListProps<T extends BaseChatMediaItem> {
  sections: { title: string; data: T[] }[];
  onEndReached: () => void;
}

export function MediaSectionList<T extends BaseChatMediaItem>({
  sections,
  onEndReached,
}: MediaSectionListProps<T>) {
  const flattenedData = useMemo(() => {
    const flat: (string | T[])[] = [];
    sections.forEach((section) => {
      flat.push(section.title);
      for (let i = 0; i < section.data.length; i += COLUMN_COUNT) {
        flat.push(section.data.slice(i, i + COLUMN_COUNT));
      }
    });
    return flat;
  }, [sections]);

  const stickyHeaderIndices = useMemo(() => {
    return flattenedData
      .map((item, index) => (typeof item === 'string' ? index : null))
      .filter((item) => item !== null) as number[];
  }, [flattenedData]);

  const mediaData = useMemo(() => {
    const items: any[] = [];
    const idToIndex: Record<string, number> = {};

    sections.forEach((section) => {
      section.data.forEach((item) => {
        const uri = item.remoteUrl || item.localUri || item.thumbnailUri;
        if (uri) {
          idToIndex[item.id] = items.length;
          items.push({
            path: uri,
            type: item.contentType,
            ...(item.contentType === 'video' && item.thumbnailUri
              ? { thumbnail: item.thumbnailUri }
              : {}),
          });
        }
      });
    });

    return { items, idToIndex };
  }, [sections]);

  const handlePreviewMedia = (id: string) => {
    const index = mediaData.idToIndex[id];
    if (index !== undefined && mediaData.items.length > 0) {
      openPreview(mediaData.items, index, { language: 'system' });
    }
  };

  return (
    <Box className="flex-1">
      <FlashList
        data={flattenedData}
        keyExtractor={(_, index) => `item-${index}`}
        contentContainerStyle={{ paddingHorizontal: SPACING / 2 }}
        stickyHeaderIndices={stickyHeaderIndices}
        getItemType={(item) => (typeof item === 'string' ? 'sectionHeader' : 'row')}
        renderItem={({ item }) => {
          if (typeof item === 'string') {
            return (
              <Box className="bg-background py-3">
                <Text className="px-2 font-semibold text-gray-500">{item}</Text>
              </Box>
            );
          } else {
            const row = item;
            return (
              <Box className="flex-row">
                {row.map((mediaItem) => (
                  <Pressable key={mediaItem.id} onPress={() => handlePreviewMedia(mediaItem.id)}>
                    <Image
                      source={{
                        uri:
                          mediaItem.thumbnailUri ||
                          mediaItem.localUri ||
                          mediaItem.remoteUrl ||
                          undefined,
                      }}
                      style={{
                        width: ITEM_SIZE,
                        height: ITEM_SIZE,
                        margin: SPACING / 2,
                        backgroundColor: '#e5e5e5',
                      }}
                      contentFit="cover"
                    />
                  </Pressable>
                ))}
                {/* Fill empty spots in the last row to maintain alignment */}
                {Array.from({ length: COLUMN_COUNT - row.length }).map((_, i) => (
                  <Box key={`empty-${i}`} style={{ width: ITEM_SIZE, margin: SPACING / 2 }} />
                ))}
              </Box>
            );
          }
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text className="mt-10 text-center text-gray-500">No media found</Text>}
      />
    </Box>
  );
}
