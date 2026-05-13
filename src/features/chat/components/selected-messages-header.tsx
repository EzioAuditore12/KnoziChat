import type { ComponentProps } from 'react';
import { cn } from '@gluestack-ui/utils';

import { HStack } from '@/components/ui/hstack';
import { ArrowLeftIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

interface SelectedMessageHeaderProps extends ComponentProps<typeof HStack> {
  onPressArrowBack: ThrottledTouchableProps['onPress'];
  selectedMessagesLength: number;
}

export function SelectedMessageHeader({
  className,
  onPressArrowBack,
  selectedMessagesLength,
  ...props
}: SelectedMessageHeaderProps) {
  return (
    <HStack
      className={cn(
        'items-center border-b border-gray-200 bg-white p-4 pb-2 dark:border-gray-800 dark:bg-black',
        className
      )}
      {...props}>
      <ThrottledTouchable onPress={onPressArrowBack} className="mr-6">
        <Icon as={ArrowLeftIcon} size="xl" className="text-black dark:text-white" />
      </ThrottledTouchable>
      <Text size="xl" className="font-bold">
        {selectedMessagesLength}
      </Text>
    </HStack>
  );
}
