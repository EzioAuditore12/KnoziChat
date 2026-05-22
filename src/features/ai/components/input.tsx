import { Keyboard, View, type ViewProps } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { cn } from '@gluestack-ui/utils';
import { Controller, useForm } from 'react-hook-form';
import { type } from 'arktype';
import { arktypeResolver } from '@hookform/resolvers/arktype';

import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';

import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';
import { ConversationGroup } from '@/db/tables/conversation-group.table';
import { AskAiParam } from '../schemas/ask-ai/param.schema';

interface AiChatInputProps extends ViewProps {
  groups: Pick<ConversationGroup, 'id' | 'name'>[];
  isLoadingGroups: boolean;
  handleMutation: (params: Omit<AskAiParam, 'chats'>) => void;
  isMutationPending: boolean;
}

const paramSchema = type({
  query: '0 < string < 120',
  groupId: 'string',
});

export function AiChatInput({
  className,
  groups,
  isLoadingGroups,
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
    resolver: arktypeResolver(paramSchema),
  });

  const { height } = useGradualAnimation();

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const onSubmit = (data: typeof paramSchema.infer) => {
    console.log(data);
    const selectedGroup = groups.find((g) => g.id === data.groupId);

    if (selectedGroup) {
      handleMutation({
        group: {
          group_id: selectedGroup.id,
          group_name: selectedGroup.name,
        },
        query: data.query,
      });
    }

    reset();
  };

  return (
    <View
      className={cn(
        'border-t border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-black',
        className
      )}
      {...props}>
      <View className="flex-row items-end gap-x-2">
        <Controller
          control={control}
          name="query"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input className={cn('flex-[2_2_0%]', errors.query && 'border-red-500')}>
              <InputField
                placeholder="Ask Knozi Ai..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                textAlignVertical="top"
                multiline
                maxLength={1000}
                className="min-h-24"
              />
            </Input>
          )}
        />
        <Controller
          control={control}
          name="groupId"
          render={({ field: { onChange, value } }) => (
            <Select className="flex-[1_1_0%]" selectedValue={value} onValueChange={onChange}>
              <SelectTrigger variant="outline" size="md">
                <SelectInput
                  placeholder={groups.length ? 'Select group' : 'No groups available'}
                  editable={false}
                />
                <SelectIcon as={ChevronDownIcon} className="mr-3" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {groups.map((group) => (
                    <SelectItem key={group.id} label={group.name} value={group.id} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          )}
        />
        <Button
          onPress={() => {
            handleSubmit(onSubmit)();
            Keyboard.dismiss();
          }}
          isDisabled={isMutationPending}
          size="sm"
          className="mb-1">
          <ButtonText>Send</ButtonText>
        </Button>
      </View>
      <Animated.View style={keyboardPadding} />
    </View>
  );
}
