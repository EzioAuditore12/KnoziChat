import type { ComponentProps } from 'react';
import { cn } from '@gluestack-ui/utils/nativewind-utils';

import { Box } from '@/components/ui/box';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText } from '@/components/ui/button';

interface SendMessageProps extends ComponentProps<typeof Box> {
  onSend: () => void;
}

export function SendMessage({ className, ...props }: SendMessageProps) {
  return (
    <Box className={cn('flex-row gap-x-1 p-1')} {...props}>
      <Textarea className="max-h-12 flex-1">
        <TextareaInput placeholder="Enter the message ..." />
      </Textarea>
      <Button>
        <ButtonText>Send</ButtonText>
      </Button>
    </Box>
  );
}
