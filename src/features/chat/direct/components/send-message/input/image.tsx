import { type ComponentProps } from 'react';
import { cn } from '@gluestack-ui/utils';
import Svg, { Circle, Path, Rect, type SvgProps } from 'react-native-svg';

import { ThrottledTouchable } from '@/components/throttled-touchable';

import { Box } from '@/components/ui/box';
import { openPicker, type Config } from '@baronha/react-native-multiple-image-picker';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { File } from '@/features/common/schemas/file.schema';

const config: Config = {
  maxSelect: 1,
  allowedLimit: false,
  primaryColor: '#FB9300',
  backgroundDark: '#2f2f2f',
  numberOfColumn: 4,
  mediaType: 'image',
  selectBoxStyle: 'number',
  selectMode: 'single',
  crop: true,
  language: 'en',
  theme: 'system',
  isHiddenOriginalButton: false,
  presentation: 'formSheet',
};

interface MediaImageInputProps extends ComponentProps<typeof VStack> {
  value: File | undefined;
  onChange: (data: File | undefined) => void;
}

function ImageSvgIcon({ width = 24, height = 24, viewBox = '0 0 24 24', ...props }: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox={viewBox} {...props}>
      <Rect x={3} y={5} width={18} height={14} rx={3} fill="white" />

      <Circle cx={9} cy={10} r={2} fill="#22c55e" />

      <Path
        d="M6 17L11 12L14 15L17 12L20 17"
        stroke="#22c55e"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function MediaImageInput({ className, value, onChange, ...props }: MediaImageInputProps) {
  return (
    <>
      <ThrottledTouchable
        onPress={async () => {
          const result = await openPicker(config);

          if (result.length === 0 || undefined) return;

          const file = result[0];

          if (!file.fileName || !file.mime || !file.size)
            throw new Error('Unable to accept the file , either corrupted');

          onChange({
            name: file.fileName,
            type: file.mime,
            uri: file.path,
            size: file.size,
            contentType: 'image',
            thumbnail: file.path,
          });
        }}>
        <VStack space="sm" className={cn('bg-background-100 items-center rounded-3xl p-5')}>
          <Box className="rounded-full bg-green-500 p-4">
            <ImageSvgIcon />
          </Box>

          <Text size="sm">Image</Text>
        </VStack>
      </ThrottledTouchable>
    </>
  );
}
