import { Button } from 'heroui-native/button';
import { Dialog, type DialogRootProps } from 'heroui-native/dialog';
import type { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { cn } from 'tailwind-variants';
import { useForm, Controller } from 'react-hook-form';
import { type } from 'arktype';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Input } from 'heroui-native/input';
import { TextField } from 'heroui-native/text-field';
import { FieldError } from 'heroui-native/field-error';
import { Label } from 'heroui-native/label';

interface GroupCreationDialogProps extends DialogRootProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  participants: string[];
  handleFormSubmit: (data: { name: string; participants: string[] }) => void;
  isFormSubmitting: boolean;
}

export function GroupCreationDialog({
  className,
  isOpen,
  setIsOpen,
  participants,
  handleFormSubmit,
  isFormSubmitting,
  ...props
}: GroupCreationDialogProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<{ name: string }>({
    defaultValues: {
      name: '',
    },
    resolver: arktypeResolver(type({ name: '0 < string <= 50' })),
  });

  const onSubmit = (data: { name: string }) => {
    console.log(data);
    handleFormSubmit({ name: data.name, participants });
  };

  return (
    <Dialog className={cn(className)} isOpen={isOpen} onOpenChange={setIsOpen} {...props}>
      <Dialog.Trigger asChild>
        <Button variant="primary">Create Group</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Close variant="ghost" />
          <View className="mb-5 gap-1.5">
            <Dialog.Title>Enter Group Details</Dialog.Title>

            <Controller
              control={control}
              name="name"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextField isRequired isInvalid={errors.name ? true : false}>
                  <Label>Name</Label>
                  <Input
                    placeholder="Enter Group Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  <FieldError>{errors.name?.message}</FieldError>
                </TextField>
              )}
            />

            <Dialog.Description>
              Are you sure you want to proceed with this action? This cannot be undone.
            </Dialog.Description>
          </View>
          <View className="flex-row justify-end gap-3">
            <Button
              isDisabled={isFormSubmitting}
              variant="ghost"
              size="sm"
              onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button isDisabled={isFormSubmitting} size="sm" onPress={handleSubmit(onSubmit)}>
              Confirm
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
