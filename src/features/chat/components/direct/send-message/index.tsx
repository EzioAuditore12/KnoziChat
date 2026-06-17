import { cn } from '@gluestack-ui/utils';
import { ComponentProps, Activity } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { arktypeResolver } from '@hookform/resolvers/arktype';
import { sendMessageSchema, type SendMessageSchemaType } from './schema';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';

import { Socket } from '@/lib/socket-io';
import { SendMessageEvent } from '../../../events/send-message';

import { MediaPicker } from './media-picker';
import { File } from '@/features/common/schemas/file.schema';
import { MediaPreviewActivity } from './media-preview';

import {
  useTypingIndicator,
  useSwipeReplyTip,
  useEmptyMessageToast,
} from './use-send-message-logic';

interface SendDirectMessageProps extends ComponentProps<typeof Box> {
  conversationId: string;
  receiverId: string;
  socket: Socket;
  handleSubmit: (data: SendMessageEvent) => void;
  onFocus?: () => boolean | void;
}

export function SendDirectMessage({
  className,
  handleSubmit,
  conversationId,
  receiverId,
  socket,
  onFocus,
  ...props
}: SendDirectMessageProps) {
  const { height } = useGradualAnimation();
  const keyboardPadding = useAnimatedStyle(() => ({ height: height.value }), []);

  const showEmptyMessageToast = useEmptyMessageToast();
  const { handleTyping, handleStopTyping } = useTypingIndicator(socket, conversationId);
  const handleFocus = useSwipeReplyTip(onFocus);

  const {
    control,
    reset,
    handleSubmit: handleFormSubmit,
  } = useForm<SendMessageSchemaType>({
    defaultValues: {
      text: '',
      file: undefined,
    },
    resolver: arktypeResolver(sendMessageSchema),
  });

  const onSubmit = (data: { text?: string; file?: File | undefined }) => {
    console.log(data);

    const rawText = typeof data.text === 'string' ? data.text : '';
    const trimmed = rawText.trimEnd();
    const content = trimmed === '' ? null : trimmed;

    // Block sending empty text when there's no file attached
    if (content === null && data.file === undefined) {
      showEmptyMessageToast();
      return;
    }

    handleSubmit({
      conversationId,
      receiverId,
      socket,
      content,
      file: data.file,
      deletedAt: undefined,
    });

    handleStopTyping();
    reset();
  };

  return (
    <Box
      className={cn(
        'border-t border-zinc-200 bg-white pt-1 pb-1 dark:border-zinc-800 dark:bg-zinc-950',
        className
      )}
      {...props}>
      <Controller
        control={control}
        name="file"
        render={({ field: { onChange, value } }) => (
          <>
            <Activity mode={value ? 'visible' : 'hidden'}>
              <MediaPreviewActivity
                file={value}
                onRemove={() => onChange(undefined)}
                className="mx-2 mt-2"
              />
            </Activity>

            <HStack className="items-end gap-2 px-3 py-3">
              <MediaPicker value={value} onChange={onChange} />

              <Controller
                control={control}
                name="text"
                render={({ field: { onChange, value } }) => (
                  <Input className="max-h-32 flex-1 rounded-3xl border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                    <InputField
                      placeholder="Message..."
                      value={value}
                      textAlignVertical="center"
                      multiline
                      numberOfLines={8}
                      maxLength={1000}
                      className="min-h-[44px] px-4 py-2.5 text-base"
                      onFocus={handleFocus}
                      onBlur={handleStopTyping}
                      onChangeText={(text) => {
                        onChange(text);
                        handleTyping();
                      }}
                    />
                  </Input>
                )}
              />

              <Button
                onPress={handleFormSubmit(onSubmit)}
                size="sm"
                className="h-[44px] self-end rounded-full px-5">
                <ButtonText>Send</ButtonText>
              </Button>
            </HStack>
          </>
        )}
      />

      <Animated.View style={keyboardPadding} />
    </Box>
  );
}
