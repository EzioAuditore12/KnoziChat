import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Controller, useForm } from 'react-hook-form';
import { View, type ViewProps } from 'react-native';
import type { Except } from 'type-fest';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils';

import {
  registerFormParamSchema,
  type RegisterFormParam,
} from '../schemas/register-form/register-form-params.schema';

interface RegisterFormProps extends ViewProps {
  isSubmitting: boolean;
  handleSubmit: (data: Except<RegisterFormParam, 'confirmPassword'>) => void;
}

export function RegisterForm({
  className,
  handleSubmit,
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
        <Text variant={'small'} className="text-red-500">
          {errors.firstName.message}
        </Text>
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
        <Text variant={'small'} className="text-red-500">
          {errors.middleName.message}
        </Text>
      )}

      <Controller
        control={control}
        name="lastName"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input placeholder="Last Name" value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
      />

      {errors.lastName && (
        <Text variant={'small'} className="text-red-500">
          {errors.lastName.message}
        </Text>
      )}

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
        <Text variant={'small'} className="text-red-500">
          {errors.email.message}
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
          Password must be 8-16 characters, include uppercase, lowercase, number, and special
          character
        </Text>
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
        <Text variant={'small'} className="text-red-500">
          {errors.confirmPassword.message}
        </Text>
      )}

      <Button onPress={handleFormSubmit(onSubmit)} disabled={isSubmitting}>
        <Text> {isSubmitting ? 'Submitting' : 'Submit'}</Text>
      </Button>
    </View>
  );
}
