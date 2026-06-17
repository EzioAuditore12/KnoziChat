import { cn } from '@gluestack-ui/utils';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { type } from 'arktype';
import type { ComponentProps } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { InitializeDirectChatParam } from '../schemas/initialize-direct-chat/param.schema';
import { SnowFlakeId } from '@/lib/snowflake';

interface SendFirstMessageProps extends ComponentProps<typeof Box> {
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

  // TODO: Right Now done for text will make it dynamic to all fields
  const onSubmit = (data: { text: string }) => {
    handleSubmit({
      receiverId,
      content: data.text,
      contentType: 'text',
      attachmentUrl: null,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      id: new SnowFlakeId(1).generate().toString(),
    });
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
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                textAlignVertical="top"
                multiline
                numberOfLines={8}
                maxLength={1000}
              />
            </Input>
          )}
        />

        <Button onPress={handlFormSubmit(onSubmit)} size="sm" isDisabled={isPending}>
          <ButtonText>Send</ButtonText>
        </Button>
      </HStack>

      <Animated.View style={keyboardPadding} />
    </Box>
  );
}
