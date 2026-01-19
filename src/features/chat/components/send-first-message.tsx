import { View, type ViewProps } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { cn } from '@/lib/utils';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { type } from 'arktype';
import { useOptimisticUpdate } from '@/db/hooks/use-optimistic-update';
import { database } from '@/db';
import syncEngine from '@/db/sync';
import { USER_TABLE_NAME } from '@/db/schemas/user-table.schema';
import { SyncOperation } from '@/db/types';
import { Collection } from '@nozbe/watermelondb';
import { User } from '@/db/models/user.model';

interface SendFirstMessageProps extends ViewProps {
  receiverId: string;
  handleSubmit: (text: string, receiverId: string) => void;
}

export function SendFirstMessage({
  className,
  receiverId,
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
    reset,

    handleSubmit: handlFormSubmit,
  } = useForm({
    defaultValues: {
      text: '',
    },
    resolver: arktypeResolver(type({ text: '0 < string <= 1000' })),
  });

  const { execute } = useOptimisticUpdate(database, syncEngine);

  const onSubmit = (data: { text: string }) => {};

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
          <Text>Send</Text>
        </Button>
      </View>

      <Animated.View style={keyboardPadding} />
    </View>
  );
}
