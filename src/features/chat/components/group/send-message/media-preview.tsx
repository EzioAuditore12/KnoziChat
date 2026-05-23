import { cn } from '@gluestack-ui/utils';

import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from 'react-native';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { CloseIcon, Icon } from '@/components/ui/icon';

import type { File } from '@/features/common/schemas/file.schema';

interface MediaPreviewActivityProps {
  file: File;
  onRemove: () => void;
  className?: string;
}

export function MediaPreviewActivity({ file, onRemove, className }: MediaPreviewActivityProps) {
  return (
    <Card
      className={cn(
        'bg-background-50 w-full self-stretch overflow-hidden rounded-2xl p-0',
        className
      )}>
      <Box className="relative">
        {(file.contentType === 'image' || file.contentType === 'video') && (
          <Image
            source={{ uri: file.thumbnail }}
            alt="preview"
            className="block h-36 w-full object-cover"
          />
        )}

        <Pressable
          onPress={onRemove}
          className="bg-background-100 absolute top-2 right-2 z-10 rounded-full p-2">
          <Icon as={CloseIcon} size="sm" />
        </Pressable>

        <Box className="p-3">
          <HStack className="items-center gap-3">
            <Box className="flex-1">
              <Text className="font-medium" numberOfLines={1}>
                {file.name}
              </Text>

              <Text className="text-xs opacity-60" numberOfLines={1}>
                {file.contentType}
              </Text>
            </Box>
          </HStack>
        </Box>
      </Box>
    </Card>
  );
}
