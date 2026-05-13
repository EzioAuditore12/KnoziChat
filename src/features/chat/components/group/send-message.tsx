import { cn } from '@gluestack-ui/utils';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { type } from 'arktype';
import { type ComponentProps, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Toast, ToastTitle, ToastDescription, useToast } from '@/components/ui/toast';

import { HStack } from '@/components/ui/hstack';
import { useGradualAnimation } from '@/hooks/use-gradual-animation';
import { Socket } from '@/lib/socket-io';
import { SendGroupMessageEvent } from '../../events/send-group-message.event';

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
    },
    resolver: arktypeResolver(type({ text: '0 < string < 1000' })),
  });

  const onSubmit = (data: { text: string }) => {
    handleSubmit({ conversationId: id, senderId, socket, text: data.text.trimEnd() });
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
    <Box className={cn('border-t-2 border-gray-400', className)} {...props}>
      <HStack className="items-center p-2">
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input className="mr-2 w-[80%]">
              <InputField
                placeholder="Type a message..."
                onFocus={handleFocus}
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                textAlignVertical="top"
                multiline
                numberOfLines={8}
                maxLength={1000}
              />
            </Input>
          )}
        />

        <Button onPress={handlFormSubmit(onSubmit)} size="sm">
          <ButtonText>Send</ButtonText>
        </Button>
      </HStack>

      <Animated.View style={keyboardPadding} />
    </Box>
  );
}
