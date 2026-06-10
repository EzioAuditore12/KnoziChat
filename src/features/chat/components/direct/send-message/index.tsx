import { cn } from '@gluestack-ui/utils';
import { useEffect, useRef, useState, type ComponentProps, Activity } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useDebouncedCallback } from 'use-debounce';
import crypto from 'react-native-nitro-crypto';

import { arktypeResolver } from '@hookform/resolvers/arktype';
import { type } from 'arktype';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';

import { Socket } from '@/lib/socket-io';
import { SendMessageEvent } from '../../../events/send-message';

import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { MediaPicker } from './media-picker';
import { File, fileSchema } from '@/features/common/schemas/file.schema';
import { MediaPreviewActivity } from './media-preview';

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

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const {
    control,
    reset,
    handleSubmit: handleFormSubmit,
  } = useForm({
    defaultValues: {
      text: '',
      file: undefined,
    },
    resolver: arktypeResolver(
      type({
        text: 'string <= 1000',
        file: fileSchema.or('undefined'),
      }).narrow((data, ctx) => {
        const isEmptyText = data.text === '' || data.text === undefined;

        if (isEmptyText && data.file === undefined) {
          ctx.reject({
            expected: 'message or file required',
            actual: '',
          });
        }

        return true;
      })
    ),
  });

  const toast = useToast();

  const [toastId, setToastId] = useState<string>('0');

  const isTypingRef = useRef(false);

  const stopTyping = useDebouncedCallback(() => {
    socket?.emit('conversation:typing', {
      conversationId,
      isTyping: false,
    });

    isTypingRef.current = false;
  }, 1000);

  useEffect(() => {
    return () => {
      stopTyping.cancel();

      socket?.emit('conversation:typing', {
        conversationId,
        isTyping: false,
      });
    };
  }, [conversationId, socket, stopTyping]);

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

  // TODO: Need to implement photo upload
  const onSubmit = (data: { text?: string; file?: File | undefined }) => {
    console.log(data);

    const rawText = typeof data.text === 'string' ? data.text : '';
    const trimmed = rawText.trimEnd();
    const content = trimmed === '' ? null : trimmed;

    // Block sending empty text when there's no file attached
    if (content === null && data.file === undefined) {
      const newId = crypto.randomInt.toString();

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
      conversationId,
      receiverId,
      socket,
      content,
      file: data.file,
      deletedAt: undefined,
    });

    stopTyping.cancel();

    socket?.emit('conversation:typing', {
      conversationId,
      isTyping: false,
    });

    isTypingRef.current = false;

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
                      numberOfLines={1}
                      maxLength={1000}
                      className="min-h-[44px] px-4 py-2.5 text-base"
                      onFocus={() => {
                        handleFocus();
                      }}
                      onBlur={() => {
                        stopTyping.cancel();

                        socket?.emit('conversation:typing', {
                          conversationId,
                          isTyping: false,
                        });

                        isTypingRef.current = false;
                      }}
                      onChangeText={(text) => {
                        onChange(text);

                        if (!isTypingRef.current) {
                          isTypingRef.current = true;

                          socket?.emit('conversation:typing', {
                            conversationId,
                            isTyping: true,
                          });
                        }

                        stopTyping();
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
