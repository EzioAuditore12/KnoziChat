import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Controller, useForm } from 'react-hook-form';
import { View, type ViewProps } from 'react-native';
import type { Except } from 'type-fest';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';
import { Description } from 'heroui-native/description';
import { cn } from 'tailwind-variants';

import {
  registerFormParamSchema,
  type RegisterFormParam,
} from '../schemas/register-form/register-form-params.schema';

interface RegisterFormProps extends ViewProps {
  expoPushToken: string | null;
  isSubmitting: boolean;
  handleSubmit: (data: Except<RegisterFormParam, 'confirmPassword'>) => void;
}

export function RegisterForm({
  className,
  handleSubmit,
  expoPushToken,
  isSubmitting,
  ...props
}: RegisterFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit: handleFormSubmit,
  } = useForm<RegisterFormParam>({
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: arktypeResolver(registerFormParamSchema),
  });

  const onSubmit = (data: RegisterFormParam) => {
    const { confirmPassword, ...rest } = data;

    if (expoPushToken !== null) data.expoPushToken = expoPushToken;

    handleSubmit(rest);
  };

  return (
    <View className={cn('gap-y-3 p-2', className)} {...props}>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input placeholder="First Name" value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
      />

      {errors.firstName && (
        <Description className="text-sm text-red-500">{errors.firstName.message}</Description>
      )}

      <Controller
        control={control}
        name="middleName"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            placeholder="Middle Name (Optional)"
            className="bg-transparent"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {errors.middleName && (
        <Description className="text-sm text-red-500">{errors.middleName.message}</Description>
      )}

      <Controller
        control={control}
        name="lastName"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input placeholder="Last Name" value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
      />

      {errors.lastName && (
        <Description className="text-sm text-red-500">{errors.lastName.message}</Description>
      )}

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
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            placeholder="Email (Optional)"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {errors.email && (
        <Description className="text-sm text-red-500">{errors.email.message}</Description>
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
        <Description className="text-sm text-red-500">
          Password must be 8-16 characters, include uppercase, lowercase, number, and special
          character
        </Description>
      )}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { value, onBlur, onChange } }) => (
          <Input
            value={value}
            placeholder="Confirm Password"
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
          />
        )}
      />

      {errors.confirmPassword && (
        <Description className="text-sm text-red-500">{errors.confirmPassword.message}</Description>
      )}

      <Button onPress={handleFormSubmit(onSubmit)} isDisabled={isSubmitting}>
        {isSubmitting ? 'Submitting' : 'Submit'}
      </Button>
    </View>
  );
}
