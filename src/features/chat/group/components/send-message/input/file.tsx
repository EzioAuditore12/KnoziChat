import { type ComponentProps } from 'react';
import { cn } from '@gluestack-ui/utils';
import Svg, { Path, type SvgProps } from 'react-native-svg';
import { pickFiles } from 'react-native-nitro-file-system';

import { ThrottledTouchable } from '@/components/throttled-touchable';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { File } from '@/features/common/schemas/file.schema';

function FileSvgIcon({ width = 24, height = 24, viewBox = '0 0 24 24', ...props }: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox={viewBox} {...props}>
      <Path
        d="M7 3H14L19 8V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V5C5 3.9 5.9 3 7 3Z"
        fill="white"
      />

      <Path d="M14 3V8H19" fill="#f97316" />

      <Path d="M8 13H16" stroke="#f97316" strokeWidth={2} strokeLinecap="round" />

      <Path d="M8 17H13" stroke="#f97316" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

interface MediaFileInputProps extends ComponentProps<typeof VStack> {
  value: File | undefined;
  onChange: (data: File | undefined) => void;
}

export function MediaFileInput({ className, value, onChange, ...props }: MediaFileInputProps) {
  return (
    <>
      <ThrottledTouchable
        onPress={async () => {
          const importedFiles = await pickFiles({
            multiple: false,
            mode: 'import',
          });

          const file = importedFiles[0];

          if (!file) throw new Error('File selection cancelled.');

          if (!file.type) throw new Error('Unsupported file type');

          onChange({
            name: file.name,
            type: file.type,
            size: file.size,
            uri: file.uri,
            contentType: 'file',
          });
        }}>
        <VStack
          space="sm"
          className={cn('bg-background-100 items-center rounded-3xl p-5')}
          {...props}>
          <Box className="rounded-full bg-orange-500 p-4">
            <FileSvgIcon />
          </Box>

          <Text size="sm">File</Text>
        </VStack>
      </ThrottledTouchable>
    </>
  );
}
