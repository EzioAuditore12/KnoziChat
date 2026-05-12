import { cn } from '@gluestack-ui/utils';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { type } from 'arktype';
import type { ComponentProps } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';

import { HStack } from '@/components/ui/hstack';
import { useGradualAnimation } from '@/hooks/use-gradual-animation';
import { Socket } from '@/lib/socket-io';
import { SendGroupMessageEvent } from '../../events/send-group-message.event';

interface SendGroupMessageProps extends ComponentProps<typeof Box> {
  id: string;
  senderId: string;
  socket: Socket;
  handleSubmit: (data: SendGroupMessageEvent) => void;
}

export function SendGroupMessage({
  className,
  id,
  senderId,
  socket,
  handleSubmit,
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
