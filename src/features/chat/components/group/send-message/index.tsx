import { cn } from '@gluestack-ui/utils';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { type } from 'arktype';
import { type ComponentProps, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import crypto from 'react-native-nitro-crypto';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Toast, ToastTitle, ToastDescription, useToast } from '@/components/ui/toast';

import { HStack } from '@/components/ui/hstack';
import { useGradualAnimation } from '@/hooks/use-gradual-animation';
import { Socket } from '@/lib/socket-io';
import { SendGroupMessageEvent } from '../../../events/send-group-message';
import { File, fileSchema } from '@/features/common/schemas/file.schema';
import { MediaPreviewActivity } from './media-preview';
import { MediaPicker } from './media-picker';

interface SendGroupMessageProps extends ComponentProps<typeof Box> {
  id: string;
  senderId: string;
  socket: Socket;
  handleSubmit: (data: SendGroupMessageEvent) => void;
  onFocus?: () => boolean | void;
}

export function SendGroupMessage({
  className,
  id,
  senderId,
  socket,
  handleSubmit,
  onFocus,
  ...props
}: SendGroupMessageProps) {
  const { height } = useGradualAnimation();

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const {
    control,
    reset,
    handleSubmit: handlFormSubmit,
  } = useForm({
    defaultValues: {
      text: '',
      file: undefined,
    },
    resolver: arktypeResolver(
      type({ text: 'string <= 1000', file: fileSchema.or('undefined') }).narrow((data, ctx) => {
        const isEmptyText = data.text === '' || data.text === undefined;

        if (isEmptyText && data.file === undefined) {
          ctx.reject({ expected: 'message or file required', actual: '' });
        }

        return true;
      })
    ),
  });

  const onSubmit = (data: { text?: string; file?: File | undefined }) => {
    const rawText = typeof data.text === 'string' ? data.text : '';
    const trimmed = rawText.trimEnd();
    const content = trimmed === '' ? null : trimmed;

    if (content === null && data.file === undefined) {
      const newId = crypto.randomInt.toString();
      setToastId(newId);
      toast.show({
        id: newId,
        placement: 'top',
        duration: 2000,
        render: ({ id: toastRenderingId }) => {
          const uniqueToastId = 'toast-' + toastRenderingId;
          return (
            <Toast nativeID={uniqueToastId} action="muted" variant="solid">
              <ToastTitle>Cannot send empty message</ToastTitle>
              <ToastDescription>Type a message or attach a file.</ToastDescription>
            </Toast>
          );
        },
      });

      return;
    }

    handleSubmit({
      conversationId: id,
      senderId,
      socket,
      content,
      file: data.file,
      deletedBy: '',
    });

    reset();
  };

  const toast = useToast();
  const [toastId, setToastId] = useState<string>('0');

  const handleFocus = () => {
    const didDeselect = onFocus?.();
    if (didDeselect && !toast.isActive(toastId)) {
      const newId = Math.random().toString();
      setToastId(newId);
      toast.show({
        id: newId,
        placement: 'top',
        duration: 3000,
        render: ({ id: toastRenderingId }) => {
          const uniqueToastId = 'toast-' + toastRenderingId;
          return (
            <Toast nativeID={uniqueToastId} action="muted" variant="solid">
              <ToastTitle>Tip</ToastTitle>
              <ToastDescription>You can swipe right on a message to reply to it!</ToastDescription>
            </Toast>
          );
        },
      });
    }
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
            {value && (
              <MediaPreviewActivity
                file={value}
                onRemove={() => onChange(undefined)}
                className="mx-2 mt-2"
              />
            )}
          </>
        )}
      />

      <HStack className="items-end gap-2 px-3 py-3">
        <Controller
          control={control}
          name="file"
          render={({ field: { onChange, value } }) => (
            <>
              <MediaPicker value={value} onChange={onChange} />

              <Controller
                control={control}
                name="text"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input className="max-h-32 flex-1 rounded-3xl border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                    <InputField
                      placeholder="Message..."
                      onFocus={handleFocus}
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                      textAlignVertical="center"
                      multiline
                      numberOfLines={1}
                      maxLength={1000}
                      className="min-h-[44px] px-4 py-2.5 text-base"
                    />
                  </Input>
                )}
              />

              <Button
                onPress={handlFormSubmit(onSubmit)}
                size="sm"
                className="h-[44px] self-end rounded-full px-5">
                <ButtonText>Send</ButtonText>
              </Button>
            </>
          )}
        />
      </HStack>

      <Animated.View style={keyboardPadding} />
    </Box>
  );
}
