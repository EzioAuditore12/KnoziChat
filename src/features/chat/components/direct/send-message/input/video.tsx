import { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } from 'expo-image-picker';
import { type ComponentProps } from 'react';
import { cn } from '@gluestack-ui/utils';
import Svg, { Path, Polygon, Rect, type SvgProps } from 'react-native-svg';

import { ThrottledTouchable } from '@/components/throttled-touchable';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

import type { File } from '@/features/common/schemas/file.schema';

interface MediaVideoInputProps extends ComponentProps<typeof VStack> {
  value: File | undefined;
  onChange: (data: File | undefined) => void;
}

function VideoSvgIcon({ width = 24, height = 24, viewBox = '0 0 24 24', ...props }: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox={viewBox}>
      <Rect x={3} y={5} width={14} height={14} rx={3} fill="white" />

      <Polygon points="10,9 16,12 10,15" fill="#3b82f6" />

      <Path d="M17 10L21 8V16L17 14" fill="#3b82f6" />
    </Svg>
  );
}

export function MediaVideoInput({ className, value, onChange, ...props }: MediaVideoInputProps) {
  return (
    <>
      <ThrottledTouchable
        onPress={async () => {
          const permissionResult = await requestMediaLibraryPermissionsAsync();

          if (!permissionResult.granted) {
            alert('Permission required to access the media library is required.');

            return;
          }

          const result = await launchImageLibraryAsync({
            mediaTypes: ['videos'],
            selectionLimit: 1,
            quality: 1,
          });

          if (result.canceled) return;

          const file = result.assets[0];

          if (!file.fileName || !file.mimeType || !file.fileSize)
            throw new Error('Unable to accept the file , either corrupted');

          onChange({
            name: file.fileName,
            type: file.mimeType,
            uri: file.uri,
            size: file.fileSize,
            contentType: 'video',
          });
        }}>
        <VStack space="sm" className={cn('bg-background-100 items-center rounded-3xl p-5')}>
          <Box className="rounded-full bg-blue-500 p-4">
            <VideoSvgIcon />
          </Box>

          <Text size="sm">Video</Text>
        </VStack>
      </ThrottledTouchable>
    </>
  );
}
