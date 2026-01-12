import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Controller, useForm } from 'react-hook-form';
import { View, type ViewProps } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils';

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
        <Text variant={'small'} className="text-red-500">
          {errors.phoneNumber.message}
        </Text>
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
        <Text variant={'small'} className="text-red-500">
          {errors.password.message}
        </Text>
      )}

      <Button onPress={handleFormSubmit(onSubmit)} disabled={isSubmitting}>
        <Text> {isSubmitting ? 'Submitting' : 'Submit'}</Text>
      </Button>
    </View>
  );
}
