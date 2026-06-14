import { useState } from 'react';
import { Keyboard, View, type ViewProps } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { cn } from '@gluestack-ui/utils';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { type } from 'arktype';
import { arktypeResolver } from '@hookform/resolvers/arktype';

import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';
import { AskAiParam } from '../../schemas/ask-ai/param.schema';

import { GroupPickerModal } from './group-picker-modal';
import { GroupPickerTrigger } from './group-picker-trigger';
import type { ChatOption } from './types';

interface AiChatInputProps extends ViewProps {
  chats: ChatOption[];
  isLoadingChats: boolean;
  handleMutation: (params: Omit<AskAiParam, 'chats'>) => void;
  isMutationPending: boolean;
}

const paramSchema = type({
  query: '0 < string < 120',
  groupId: 'string', // keeping the schema key the same for form
});

export function AiChatInput({
  className,
  chats,
  isLoadingChats,
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
      groupId: '',
    },
    resolver: arktypeResolver(paramSchema),
  });

  const [isGroupPickerOpen, setIsGroupPickerOpen] = useState(false);

  const selectedGroupId = useWatch({ control, name: 'groupId' });

  const { height } = useGradualAnimation();

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const selectedChat = chats.find((chat) => chat.id === selectedGroupId);

  const onSubmit = (data: typeof paramSchema.infer) => {
    const chosenChat = chats.find((chat) => chat.id === data.groupId);

    if (chosenChat) {
      handleMutation({
        group: {
          groupId: chosenChat.id,
          groupName: chosenChat.name,
        },
        query: data.query,
      });
    }

    reset();
    setIsGroupPickerOpen(false);
  };

  return (
    <View
      className={cn(
        'border-t border-gray-200 bg-white/95 px-3 py-3 shadow-[0_-1px_0_rgba(0,0,0,0.04)] backdrop-blur dark:border-gray-800 dark:bg-black/95',
        className
      )}
      {...props}>
      <View className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-zinc-950">
        <View className="flex-col gap-3 md:flex-row md:items-end">
          <Controller
            control={control}
            name="query"
            render={({ field: { onBlur, onChange, value } }) => (
              <Input className={cn('min-w-0 flex-1', errors.query && 'border-red-500')}>
                <InputField
                  placeholder="Ask Knozi Ai..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  maxLength={1000}
                  className="min-h-24 py-3 text-zinc-900 placeholder:text-zinc-500 dark:text-zinc-50 dark:placeholder:text-zinc-400"
                />
              </Input>
            )}
          />

          <Controller
            control={control}
            name="groupId"
            render={({ field: { onChange } }) => (
              <View className="w-full md:w-56 md:shrink-0 lg:w-64">
                <GroupPickerTrigger
                  selectedChat={selectedChat as ChatOption | undefined}
                  isLoadingChats={isLoadingChats}
                  placeholder={chats.length ? 'Select chat' : 'No chats available'}
                  onPress={() => setIsGroupPickerOpen(true)}
                />

                <GroupPickerModal
                  chats={chats}
                  isLoadingChats={isLoadingChats}
                  isOpen={isGroupPickerOpen}
                  onClose={() => setIsGroupPickerOpen(false)}
                  selectedChatId={selectedGroupId}
                  onSelectChat={onChange}
                />
              </View>
            )}
          />

          <Button
            onPress={() => {
              handleSubmit(onSubmit)();
              Keyboard.dismiss();
            }}
            isDisabled={isMutationPending}
            className="h-12 w-full md:w-auto md:shrink-0">
            <ButtonText>Send</ButtonText>
          </Button>
        </View>
      </View>

      <Animated.View style={keyboardPadding} />
    </View>
  );
}
