import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { cn } from '@gluestack-ui/utils';
import { useRef, type ComponentProps } from 'react';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { CloseIcon } from '@/components/ui/icon';
import { Grid, GridItem } from '@/components/ui/grid';

import { MediaImageInput } from './input/image';
import { MediaVideoInput } from './input/video';
import { MediaFileInput } from './input/file';

import { File } from '@/features/common/schemas/file.schema';
import { AttachmentFileIcon } from './input/attachment-icon';

interface MediaPickerProps extends ComponentProps<typeof Box> {
  value: File | undefined;
  onChange: (data: File | undefined) => void;
}

export function MediaPicker({ className, value, onChange, ...props }: MediaPickerProps) {
  const sheet = useRef<TrueSheet>(null);

  const present = async () => {
    await sheet.current?.present(1);
  };

  const dismiss = async () => {
    await sheet.current?.dismiss();
  };

  const handleChange = (data: File | undefined) => {
    onChange(data);

    if (data) {
      void dismiss();
    }
  };

  return (
    <Box className={cn(className)} {...props}>
      <Button
        onPress={present}
        variant="link"
        className="h-11 w-11 items-center justify-center rounded-full p-0">
        <ButtonIcon as={AttachmentFileIcon} className="text-zinc-500 dark:text-zinc-400" />
      </Button>

      <TrueSheet ref={sheet} detents={['auto', 0.5, 1]}>
        <Box className="relative h-full w-full px-6 pt-14 pb-8">
          <Button className="absolute top-2 right-6 z-10 mt-2 rounded-full" onPress={dismiss}>
            <ButtonIcon as={CloseIcon} className="size-5" />
          </Button>

          <Grid
            className="gap-4"
            _extra={{
              className: 'grid-cols-9',
            }}>
            <GridItem
              _extra={{
                className: 'col-span-3',
              }}>
              <MediaImageInput value={value} onChange={handleChange} />
            </GridItem>

            <GridItem
              _extra={{
                className: 'col-span-3',
              }}>
              <MediaVideoInput value={value} onChange={handleChange} />
            </GridItem>

            <GridItem
              _extra={{
                className: 'col-span-3',
              }}>
              <MediaFileInput value={value} onChange={handleChange} />
            </GridItem>
          </Grid>
        </Box>
      </TrueSheet>
    </Box>
  );
}
