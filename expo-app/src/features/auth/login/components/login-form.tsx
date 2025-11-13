import type { ComponentProps } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@gluestack-ui/utils/nativewind-utils';

import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';

import {
  loginFormParamsSchema,
  type LoginFormParams,
} from '../schemas/login-form-param.schema';
import { Text } from '@/components/ui/text';

interface LoginFormProps extends ComponentProps<typeof VStack> {
  handleFormSubmit: (data: LoginFormParams) => void;
  isFormSubmitting: boolean;
}

export function LoginForm({
  className,
  handleFormSubmit,
  isFormSubmitting,
  ...props
}: LoginFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormParams>({
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
    resolver: zodResolver(loginFormParamsSchema),
  });

  const onSubmit = (data: LoginFormParams) => {
    handleFormSubmit(data);
  };

  return (
    <VStack space="2xl" className={cn('p-2', className)} {...props}>
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input>
            <InputField
              placeholder="Enter your phone number"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          </Input>
        )}
      />

      {errors.phoneNumber && (
        <Text className="text-red-500">{errors.phoneNumber.message}</Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input>
            <InputField
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          </Input>
        )}
      />

      {errors.password && (
        <Text className="text-red-500">{errors.password.message}</Text>
      )}

      <Button disabled={isFormSubmitting} onPress={handleSubmit(onSubmit)}>
        <ButtonText>{isFormSubmitting ? 'Loading...' : 'Login'}</ButtonText>
      </Button>
    </VStack>
  );
}
