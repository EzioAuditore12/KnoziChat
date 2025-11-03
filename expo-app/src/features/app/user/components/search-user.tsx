import { cn } from '@gluestack-ui/utils/nativewind-utils';
import type { ComponentProps } from 'react';

import { Input, InputField } from '@/components/ui/input';

interface SearchUserInputProps extends ComponentProps<typeof Input> {
    onChangeText: ComponentProps<typeof InputField>['onChangeText'],
    value: ComponentProps<typeof InputField>['value'],
}

export function SearchUserInput({ className,onChangeText,value, ...props }: SearchUserInputProps) {
  return (
    <Input className={cn(className)} {...props}>
      <InputField
      placeholder='Search Users ...' 
      onChangeText={onChangeText}
      value={value}
      />
    </Input>
  );
}
