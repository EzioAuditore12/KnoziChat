import { View, type ViewProps } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { cn } from 'tailwind-variants';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

import { type } from 'arktype';
import { SendMessageEvent } from '@/features/realtime/events/send-message.event';
import { Socket } from '@/lib/socket-io';

interface SendDirectMessageProps extends ViewProps {
  conversationId: string;
  socket: Socket;
  handleSubmit: ({ socket, conversationId, text }: SendMessageEvent) => void;
}

export function SendDirectMessage({
  className,
  socket,
  conversationId,
  handleSubmit,
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
    resolver: arktypeResolver(type({ text: 'string' })),
  });

  const onSubmit = (data: { text: string }) => {
    reset();

    handleSubmit({ socket, conversationId, text: data.text });
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
