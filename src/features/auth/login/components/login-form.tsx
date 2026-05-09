import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Controller, useForm } from 'react-hook-form';
import { View, type ViewProps } from 'react-native';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';
import { FieldError } from 'heroui-native/field-error';
import { TextField } from 'heroui-native/text-field';
import { Label } from 'heroui-native/label';
import { cn } from 'tailwind-variants';

import { loginParamSchema, type LoginParam } from '../schemas/login-param.schema';

interface LoginFormProps extends ViewProps {
  expoPushToken: string | null;
  isSubmitting: boolean;
  handleSubmit: (data: LoginParam) => void;
}

export function LoginForm({
  className,
  handleSubmit,
  expoPushToken,
  isSubmitting,
  ...props
}: LoginFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit: handleFormSubmit,
  } = useForm<LoginParam>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: arktypeResolver(loginParamSchema),
  });

  const onSubmit = (data: LoginParam) => {
    if (expoPushToken !== null) data.expoPushToken = expoPushToken;
    handleSubmit(data);
  };

  return (
    <View className={cn('gap-y-2 p-2', className)} {...props}>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField isRequired isInvalid={errors.email ? true : false}>
            <Label>Email</Label>
            <Input
              placeholder="Enter email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
            />
            <FieldError>{errors.email?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onBlur, onChange } }) => (
          <TextField isRequired isInvalid={errors.password ? true : false}>
            <Label>Password</Label>
            <Input
              value={value}
              placeholder="Password"
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
            />
            <FieldError>{errors.password?.message}</FieldError>
          </TextField>
        )}
      />

      <Button onPress={handleFormSubmit(onSubmit)} isDisabled={isSubmitting}>
        {isSubmitting ? 'Submitting' : 'Submit'}
      </Button>
    </View>
  );
}
