import { View, type ViewProps } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { cn } from '@gluestack-ui/utils';
import { Controller, useForm } from 'react-hook-form';
import { type } from 'arktype';
import { arktypeResolver } from '@hookform/resolvers/arktype';

import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

interface AiChatInputProps extends ViewProps {
  handleMutation: (query: string) => void;
  isMutationPending: boolean;
}

const paramSchema = type({
  query: '0 < string <= 1000',
});

export function AiChatInput({
  className,
  handleMutation,
  isMutationPending,
  ...props
}: AiChatInputProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      query: '',
    },
    resolver: arktypeResolver(paramSchema),
  });

  const { height } = useGradualAnimation();

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const onSubmit = (data: typeof paramSchema.infer) => {
    handleMutation(data.query);
    reset();
  };

  return (
    <View className={cn('border-t-2 border-gray-400 bg-white dark:bg-black', className)} {...props}>
      <HStack className="items-center p-2">
        <Controller
          control={control}
          name="query"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input className={cn('mr-2 w-[80%]', errors.query && 'border-red-500')}>
              <InputField
                placeholder="Ask Knozi Ai..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                textAlignVertical="top"
                multiline
                numberOfLines={8}
                maxLength={1000}
                className="text-zinc-900 placeholder:text-zinc-500 dark:text-zinc-50 dark:placeholder:text-zinc-400"
              />
            </Input>
          )}
        />

        <Button onPress={handleSubmit(onSubmit)} size="sm" isDisabled={isMutationPending}>
          <ButtonText>Send</ButtonText>
        </Button>
      </HStack>

      <Animated.View style={keyboardPadding} />
    </View>
  );
}
