import { cn } from '@gluestack-ui/utils';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useDebouncedCallback } from 'use-debounce';

import { arktypeResolver } from '@hookform/resolvers/arktype';
import { type } from 'arktype';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';

import { Socket } from '@/lib/socket-io';
import { SendMessageEvent } from '../../events/send-message.event';

import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from '@/components/ui/toast';

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
  } = useForm<{ text: string }>({
    defaultValues: {
      text: '',
    },
    resolver: arktypeResolver(type({ text: '0 < string <= 1000' })),
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

              <ToastDescription>
                You can swipe right on a message to reply to it!
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  const onSubmit = (data: { text: string }) => {
    handleSubmit({
      conversationId,
      receiverId,
      socket,
      text: data.text,
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
      className={cn('border-t-2 border-gray-400', className)}
      {...props}
    >
      <HStack className="items-center p-2">
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange, value } }) => (
            <Input className="mr-2 w-[80%]">
              <InputField
                placeholder="Type a message..."
                value={value}
                textAlignVertical="top"
                multiline
                numberOfLines={8}
                maxLength={1000}
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

        <Button onPress={handleFormSubmit(onSubmit)} size="sm">
          <ButtonText>Send</ButtonText>
        </Button>
      </HStack>

      <Animated.View style={keyboardPadding} />
    </Box>
  );
}