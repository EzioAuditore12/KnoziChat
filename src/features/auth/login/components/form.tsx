import { VStack } from '@/components/ui/vstack';
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

import { cn } from '@gluestack-ui/utils';
import { loginParamSchema, type LoginParam } from '../schemas/param.schema';

interface LoginFormProps extends ComponentProps<typeof Box> {
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
    if (expoPushToken !== null) {
      data.expoPushToken = expoPushToken;
    }

    handleSubmit(data);
  };

  return (
    <Box className={cn('p-2', className)} {...props}>
      <VStack className="gap-4">
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
                  placeholder="Enter email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
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
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl isRequired isInvalid={!!errors.password}>
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>

              <Input>
                <InputField
                  value={value}
                  placeholder="Enter password"
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
