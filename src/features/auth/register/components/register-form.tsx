import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Controller, useForm } from 'react-hook-form';
import { View, type ViewProps } from 'react-native';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';
import { Label } from 'heroui-native/label';
import { TextField } from 'heroui-native/text-field';
import { FieldError } from 'heroui-native/field-error';
import { cn } from 'tailwind-variants';

import {
  registerFormParamSchema,
  type RegisterFormParam,
} from '../schemas/register-form/register-form-params.schema';

interface RegisterFormProps extends ViewProps {
  expoPushToken: string | null;
  isSubmitting: boolean;
  handleSubmit: (data: Omit<RegisterFormParam, 'confirmPassword'>) => void;
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
      phoneNumber: null,
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
          <TextField isRequired isInvalid={errors.firstName ? true : false}>
            <Label>First Name</Label>
            <Input
              placeholder="Enter first name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            <FieldError>{errors.firstName?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        control={control}
        name="middleName"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField isInvalid={errors.middleName ? true : false}>
            <Label>Middle Name</Label>
            <Input
              placeholder="Middle Name (Optional)"
              variant="secondary"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            <FieldError>{errors.middleName?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField isRequired isInvalid={errors.lastName ? true : false}>
            <Label>Last Name</Label>
            <Input
              placeholder="Enter last name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            <FieldError>{errors.lastName?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField isInvalid={errors.phoneNumber ? true : false}>
            <Label>Phone Number</Label>
            <Input
              placeholder="Phone Number(Optional)"
              value={value ?? ''}
              variant="secondary"
              onChangeText={onChange}
              onBlur={onBlur}
            />
            <FieldError>{errors.phoneNumber?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField isRequired isInvalid={errors.email ? true : false}>
            <Label>Email</Label>
            <Input
              placeholder="Email"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { value, onBlur, onChange } }) => (
          <TextField isRequired isInvalid={errors.confirmPassword ? true : false}>
            <Label>Confirm Password</Label>
            <Input
              value={value}
              placeholder="Confirm Password"
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
            />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </TextField>
        )}
      />

      <Button onPress={handleFormSubmit(onSubmit)} isDisabled={isSubmitting}>
        {isSubmitting ? 'Submitting' : 'Submit'}
      </Button>
    </View>
  );
}
