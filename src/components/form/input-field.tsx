import { Input, InputProps } from 'heroui-native/input';
import { Label } from 'heroui-native/label';
import { TextField } from 'heroui-native/text-field';
import { cn } from 'heroui-native/utils';
import { Activity } from 'react';
import { View } from 'react-native';

import { useFieldContext } from '@/lib/tanstack/form';
import { FieldError } from './field-error';

export type InputFieldProps = InputProps & {
  label?: string;
  isRequired?: boolean;
};

export const InputField = ({ className, label, isRequired, ...inputProps }: InputFieldProps) => {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <TextField isRequired={isRequired} isInvalid={hasError} className="w-full">
      {label && <Label>{label}</Label>}
      <Input
        className={cn('mt-2', hasError && 'border-red-500 focus:border-red-500', className)}
        id={field.name}
        value={field.state.value}
        onChangeText={field.handleChange}
        onBlur={field.handleBlur}
        {...inputProps}
      />
      <View className="min-h-5 justify-center">
        <Activity mode={hasError ? 'visible' : 'hidden'}>
          <FieldError meta={field.state.meta} />
        </Activity>
      </View>
    </TextField>
  );
};
