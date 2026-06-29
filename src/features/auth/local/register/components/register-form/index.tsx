import { cn } from 'cnfast';
import { Label } from 'heroui-native/label';
import { Activity } from 'react';
import { View, type ViewProps } from 'react-native';

import { FieldError } from '@/components/form/field-error';
import { useAppForm } from '@/hooks/use-app-form';
import {
  registerFormParamSchema,
  type RegisterFormParam,
} from '../../schemas/register-form/params.schema';
import { AvatarInput } from './avatar-input';

interface RegisterFormProps extends ViewProps {
  isSubmitting: boolean;
  handleSubmit: (data: Omit<RegisterFormParam, 'confirmPassword'>) => void;
}

export function RegisterForm({
  className,
  handleSubmit,
  isSubmitting,
  ...props
}: RegisterFormProps) {
  const Form = useAppForm({
    defaultValues: {
      firstName: '',
      middleName: undefined,
      lastName: '',
      avatar: undefined,
      phoneNumber: undefined,
      email: '',
      password: '',
      confirmPassword: '',
    } as RegisterFormParam,
    validators: {
      onChange: registerFormParamSchema,
    },
    onSubmit: async ({ value }) => {
      const { confirmPassword, ...rest } = value;
      await handleSubmit({ ...rest });
    },
  });

  return (
    <Form.AppForm>
      <View className={cn('flex-col gap-y-4 p-2', className)} {...props}>
        <Form.AppField name="avatar">
          {(field) => (
            <View className="items-center">
              <Label className="mb-2">Avatar</Label>
              <AvatarInput value={field.state.value} onChange={(val) => field.handleChange(val)} />
              <View className="min-h-5 justify-center">
                <Activity mode={field.state.meta.errors.length > 0 ? 'visible' : 'hidden'}>
                  <FieldError meta={field.state.meta} />
                </Activity>
              </View>
            </View>
          )}
        </Form.AppField>

        <Form.AppField name="firstName">
          {(field) => (
            <field.InputField label="First Name" placeholder="Enter first name" isRequired />
          )}
        </Form.AppField>

        <Form.AppField name="middleName">
          {(field) => <field.InputField label="Middle Name" placeholder="Middle Name (Optional)" />}
        </Form.AppField>

        <Form.AppField name="lastName">
          {(field) => (
            <field.InputField label="Last Name" placeholder="Enter last name" isRequired />
          )}
        </Form.AppField>

        <Form.AppField name="phoneNumber">
          {(field) => (
            <field.InputField label="Phone Number" placeholder="Phone Number (Optional)" />
          )}
        </Form.AppField>

        <Form.AppField name="email">
          {(field) => (
            <field.InputField
              label="Email"
              placeholder="Email"
              keyboardType="email-address"
              isRequired
            />
          )}
        </Form.AppField>

        <Form.AppField name="password">
          {(field) => (
            <field.InputField label="Password" placeholder="Password" secureTextEntry isRequired />
          )}
        </Form.AppField>

        <Form.AppField name="confirmPassword">
          {(field) => (
            <field.InputField
              label="Confirm Password"
              placeholder="Confirm Password"
              secureTextEntry
              isRequired
            />
          )}
        </Form.AppField>

        <Form.SubmitButton>Submit</Form.SubmitButton>
      </View>
    </Form.AppForm>
  );
}
