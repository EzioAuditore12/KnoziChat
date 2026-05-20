import { cn } from '@gluestack-ui/utils';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from 'react-native';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { CloseIcon, Icon } from '@/components/ui/icon';

import { File } from '@/features/common/schemas/file.schema';

interface MediaPreviewActivityProps {
  file: File;
  onRemove: () => void;
  className?: string;
}

export function MediaPreviewActivity({ file, onRemove, className }: MediaPreviewActivityProps) {
  return (
    <Box className={cn('border-outline-200 bg-background-50 rounded-2xl border p-3', className)}>
      <HStack className="items-center justify-between gap-3">
        <HStack className="flex-1 items-center gap-3">
          {(file.contentType === 'image' || file.contentType === 'video') && (
            <Image
              source={{
                uri: file.thumbnail,
              }}
              alt="preview"
              className="h-16 w-16 rounded-xl"
            />
          )}

          <Box className="flex-1">
            <Text className="font-medium" numberOfLines={1}>
              {file.name}
            </Text>

            <Text className="text-xs opacity-60" numberOfLines={1}>
              {file.contentType}
            </Text>
          </Box>
        </HStack>

        <Pressable onPress={onRemove} className="rounded-full p-2">
          <Icon as={CloseIcon} size="sm" />
        </Pressable>
      </HStack>
    </Box>
  );
}
