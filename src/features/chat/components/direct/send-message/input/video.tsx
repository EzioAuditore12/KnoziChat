import { openPicker, type Config } from '@baronha/react-native-multiple-image-picker';
import { type ComponentProps } from 'react';
import { cn } from '@gluestack-ui/utils';
import Svg, { Path, Polygon, Rect, type SvgProps } from 'react-native-svg';
import { MediaToolkit } from 'react-native-media-toolkit';

import { ThrottledTouchable } from '@/components/throttled-touchable';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

import type { File } from '@/features/common/schemas/file.schema';

const config: Config = {
  maxSelect: 1,
  allowedLimit: false,
  primaryColor: '#FB9300',
  backgroundDark: '#2f2f2f',
  numberOfColumn: 4,
  mediaType: 'video',
  selectBoxStyle: 'number',
  selectMode: 'single',
  language: 'en',
  theme: 'system',
  presentation: 'formSheet',
};

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
          const result = await openPicker(config);

          if (result.length === 0 || undefined) return;

          const file = result[0];

          if (!file.fileName || !file.mime || !file.size)
            throw new Error('Unable to accept the file , either corrupted');

          const thumbNail = await MediaToolkit.getThumbnail(file.path, {
            timeMs: 3000, // frame time in milliseconds, default 0
            quality: 85, // 0–100, default 80
            maxWidth: 720, // max thumbnail width (does not affect returned metadata)
          });

          console.log(thumbNail.uri);

          onChange({
            name: file.fileName,
            type: file.mime,
            uri: file.path,
            size: file.size,
            contentType: 'video',
            thumbnail: thumbNail.uri,
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
