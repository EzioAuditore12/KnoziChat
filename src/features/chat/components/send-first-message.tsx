import { View, type ViewProps } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { type } from 'arktype';
import { cn } from 'tailwind-variants';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

import { InitializeDirectChatParam } from '../schemas/initialize-direct-chat/initialize-direct-chat-param.schema';

interface SendFirstMessageProps extends ViewProps {
  receiverId: string;
  isPending: boolean;
  handleSubmit: (data: InitializeDirectChatParam) => void;
}

export function SendFirstMessage({
  className,
  receiverId,
  isPending,
  handleSubmit,
  ...props
}: SendFirstMessageProps) {
  const { height } = useGradualAnimation();

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const {
    control,

    handleSubmit: handlFormSubmit,
  } = useForm({
    defaultValues: {
      text: '',
    },
    resolver: arktypeResolver(type({ text: '0 < string <= 1000' })),
  });

  const onSubmit = (data: { text: string }) => {
    handleSubmit({ receiverId, text: data.text });
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

        <Button onPress={handlFormSubmit(onSubmit)} size="sm" isDisabled={isPending}>
          Send
        </Button>
      </View>

      <Animated.View style={keyboardPadding} />
    </View>
  );
}
