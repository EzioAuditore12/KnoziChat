import { View, type ViewProps } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { cn } from 'tailwind-variants';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { type } from 'arktype';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

import { Socket } from '@/lib/socket-io';
import { SendMessageEvent } from '../../events/send-message.event';

interface SendOneToOneMessageProps extends ViewProps {
  conversationId: string;
  receiverId: string;
  socket: Socket;
  handleSubmit: (data: SendMessageEvent) => void;
}

export function SendOneToOneMessage({
  className,
  handleSubmit,
  conversationId,
  receiverId,
  socket,
  ...props
}: SendOneToOneMessageProps) {
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
    <View className={cn('border-t-2 border-gray-400', className)} {...props}>
      <View className="flex-row items-center p-2">
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              className="mr-2 w-[80%]"
              placeholder="Type a message..."
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
              textAlignVertical="top"
              multiline
              numberOfLines={8}
              maxLength={1000}
            />
          )}
        />

        <Button onPress={handlFormSubmit(onSubmit)} size="sm">
          Send
        </Button>
      </View>

      <Animated.View style={keyboardPadding} />
    </View>
  );
}
