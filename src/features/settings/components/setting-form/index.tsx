import { cn } from '@gluestack-ui/utils';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Activity, type ComponentProps } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Grid, GridItem } from '@/components/ui/grid';

import {
  updateProfileParamSchema,
  type UpdateProfileParam,
} from '../../schemas/update-profile-param.schema';

import { AvatarInput } from './avatar-input';

import type { User } from '@/features/common/schemas/user.schema';

interface SettingFormProps extends ComponentProps<typeof Box> {
  defaultValues: User;
  isSubmitting: boolean;
  handleSubmit: (data: UpdateProfileParam) => void;
}

export function SettingForm({
  className,
  handleSubmit,
  defaultValues,
  isSubmitting,
  ...props
}: SettingFormProps) {
  const { firstName, middleName, lastName, avatar } = defaultValues;

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit: handleFormSubmit,
  } = useForm<UpdateProfileParam>({
    defaultValues: {
      firstName,
      middleName: middleName ?? undefined,
      lastName,

      avatar: avatar
        ? {
            name: `${firstName}-avatar.jpg`,
            type: 'image/jpeg',
            uri: avatar,
          }
        : undefined,
    },

    resolver: arktypeResolver(updateProfileParamSchema),
  });

  const onSubmit = (data: UpdateProfileParam) => {
    handleSubmit(data);
  };

  return (
    <Box className={cn('p-4', className)} {...props}>
      <Grid
        className="gap-x-4 gap-y-5"
        _extra={{
          className: 'grid-cols-6',
        }}>
        {/* Avatar */}
        <GridItem
          _extra={{
            className: 'col-span-6',
          }}>
          <Controller
            control={control}
            name="avatar"
            render={({ field: { value, onChange } }) => (
              <FormControl isInvalid={!!errors.avatar}>
                <FormControlLabel className="self-center">
                  <FormControlLabelText>Avatar</FormControlLabelText>
                </FormControlLabel>

                <AvatarInput
                  className="size-40 self-center"
                  value={value}
                  onChange={onChange}
                  defaultAvatarUri={avatar ?? undefined}
                />

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />

                  <FormControlErrorText>{errors.avatar?.message}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />
        </GridItem>

        {/* First Name */}
        <GridItem
          _extra={{
            className: 'col-span-6 md:col-span-3',
          }}>
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
        </GridItem>

        {/* Last Name */}
        <GridItem
          _extra={{
            className: 'col-span-6 md:col-span-3',
          }}>
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
        </GridItem>

        {/* Middle Name */}
        <GridItem
          _extra={{
            className: 'col-span-6',
          }}>
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
        </GridItem>

        {/* Save Button */}
        <GridItem
          _extra={{
            className: 'col-span-6',
          }}>
          <Activity mode={isDirty ? 'visible' : 'hidden'}>
            <Button onPress={handleFormSubmit(onSubmit)} isDisabled={isSubmitting}>
              <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                <ButtonSpinner />
              </Activity>

              <ButtonText>{isSubmitting ? 'Saving Changes' : 'Save Changes'}</ButtonText>
            </Button>
          </Activity>
        </GridItem>
      </Grid>
    </Box>
  );
}
