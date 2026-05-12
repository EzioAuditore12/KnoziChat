import { cn } from '@gluestack-ui/utils';
import type { ComponentProps } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { arktypeResolver } from '@hookform/resolvers/arktype';
import { type } from 'arktype';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';

import { Socket } from '@/lib/socket-io';
import { SendMessageEvent } from '../../events/send-message.event';

interface SendDirectMessageProps extends ComponentProps<typeof Box> {
  conversationId: string;
  receiverId: string;
  socket: Socket;
  handleSubmit: (data: SendMessageEvent) => void;
}

export function SendDirectMessage({
  className,
  handleSubmit,
  conversationId,
  receiverId,
  socket,
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
    handleSubmit: handlFormSubmit,
  } = useForm<{ text: string }>({
    defaultValues: {
      text: '',
    },
    resolver: arktypeResolver(type({ text: '0 < string <= 1000' })),
  });

  const onSubmit = (data: { text: string }) => {
    handleSubmit({ conversationId, receiverId, socket, text: data.text });

    reset();
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
