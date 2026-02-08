import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Controller, useForm } from 'react-hook-form';
import { View, type ViewProps } from 'react-native';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';
import { Description } from 'heroui-native/description';
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
      phoneNumber: '',
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
        name="phoneNumber"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input placeholder="Phone Number" value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
      />

      {errors.phoneNumber && (
        <Description className="text-sm text-red-500">{errors.phoneNumber.message}</Description>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onBlur, onChange } }) => (
          <Input
            value={value}
            placeholder="Password"
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
          />
        )}
      />

      {errors.password && (
        <Description className="text-sm text-red-500">{errors.password.message}</Description>
      )}

      <Button onPress={handleFormSubmit(onSubmit)} isDisabled={isSubmitting}>
        {isSubmitting ? 'Submitting' : 'Submit'}
      </Button>
    </View>
  );
}
