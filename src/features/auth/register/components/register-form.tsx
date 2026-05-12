import { cn } from '@gluestack-ui/utils';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Activity, type ComponentProps } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Box } from '@/components/ui/box';

import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';

import { AlertCircleIcon } from '@/components/ui/icon';

import { Input, InputField } from '@/components/ui/input';

import { VStack } from '@/components/ui/vstack';

import {
  registerFormParamSchema,
  type RegisterFormParam,
} from '../schemas/register-form/params.schema';

interface RegisterFormProps extends ComponentProps<typeof Box> {
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

    if (expoPushToken !== null) {
      data.expoPushToken = expoPushToken;
    }

    handleSubmit(rest);
  };

  return (
    <Box className={cn('gap-y-3 p-2', className)} {...props}>
      <VStack className="gap-3">
        <Controller
          control={control}
          name="firstName"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl isRequired isInvalid={!!errors.firstName}>
              <FormControlLabel>
                <FormControlLabelText>First Name</FormControlLabelText>
              </FormControlLabel>

              <Input>
                <InputField
                  placeholder="Enter first name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />

                <FormControlErrorText>{errors.firstName?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="middleName"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl isInvalid={!!errors.middleName}>
              <FormControlLabel>
                <FormControlLabelText>Middle Name</FormControlLabelText>
              </FormControlLabel>

              <Input>
                <InputField
                  placeholder="Middle Name (Optional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />

                <FormControlErrorText>{errors.middleName?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl isRequired isInvalid={!!errors.lastName}>
              <FormControlLabel>
                <FormControlLabelText>Last Name</FormControlLabelText>
              </FormControlLabel>

              <Input>
                <InputField
                  placeholder="Enter last name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />

                <FormControlErrorText>{errors.lastName?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormControlLabel>
                <FormControlLabelText>Phone Number</FormControlLabelText>
              </FormControlLabel>

              <Input>
                <InputField
                  placeholder="Phone Number (Optional)"
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />

                <FormControlErrorText>{errors.phoneNumber?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>

              <Input>
                <InputField
                  placeholder="Email"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />

                <FormControlErrorText>{errors.email?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onBlur, onChange } }) => (
            <FormControl isRequired isInvalid={!!errors.password}>
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>

              <Input>
                <InputField
                  value={value}
                  placeholder="Password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />

                <FormControlErrorText>{errors.password?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onBlur, onChange } }) => (
            <FormControl isRequired isInvalid={!!errors.confirmPassword}>
              <FormControlLabel>
                <FormControlLabelText>Confirm Password</FormControlLabelText>
              </FormControlLabel>

              <Input>
                <InputField
                  value={value}
                  placeholder="Confirm Password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />

                <FormControlErrorText>{errors.confirmPassword?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        <Button onPress={handleFormSubmit(onSubmit)} isDisabled={isSubmitting}>
          <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
            <ButtonSpinner />
          </Activity>

          <ButtonText>{isSubmitting ? 'Submitting' : 'Submit'}</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
