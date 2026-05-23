import { cn } from '@gluestack-ui/utils';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { type } from 'arktype';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';

import { AvatarInput } from './avatar-input';

import type { InitializeGroupChatParam } from '@/features/chat/schemas/initialize-group-chat/param.schema';

type GroupCreationFormValues = {
  name: string;
  avatar: InitializeGroupChatParam['avatar'];
};

interface GroupCreationDialogProps {
  className?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  participants: string[];
  handleFormSubmit: (data: {
    name: string;
    participants: string[];
    avatar: InitializeGroupChatParam['avatar'];
  }) => void;
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
  } = useForm<GroupCreationFormValues>({
    defaultValues: {
      name: '',
      avatar: undefined,
    },
    resolver: arktypeResolver(
      type({
        name: '0 < string <= 50',
        avatar: type(
          type({
            uri: 'string',
            name: 'string',
            type: 'string',
          })
        ).or('undefined'),
      })
    ),
  });

  const onSubmit = (data: GroupCreationFormValues) => {
    handleFormSubmit({ name: data.name, participants, avatar: data.avatar });
  };

  return (
    <>
      {/* 
        In Gluestack, triggers aren't natively wrapped by the Modal component.
        We render the button alongside it, triggering the controlled 'isOpen' state.
      */}
      <Button onPress={() => setIsOpen(true)}>
        <ButtonText>Create Group</ButtonText>
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className={cn(className)} {...props}>
        <ModalBackdrop className="bg-zinc-950/40 dark:bg-zinc-950/70" />

        <ModalContent className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <ModalHeader className="mb-2 border-b-0 px-4 pt-4">
            <Heading size="md" className="font-semibold text-zinc-900 dark:text-zinc-50">
              Enter Group Details
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody className="mb-6 px-4">
            <Box className="mb-4 gap-1.5">
              <Text size="sm" className="mb-4 text-zinc-500 dark:text-zinc-400">
                Are you sure you want to proceed with this action? This cannot be undone.
              </Text>

              <Controller
                control={control}
                name="avatar"
                render={({ field: { value, onChange } }) => (
                  <Box className="mb-4 items-center gap-2">
                    <FormControlLabel className="mb-1.5 self-start">
                      <FormControlLabelText className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Avatar
                      </FormControlLabelText>
                    </FormControlLabel>

                    <AvatarInput value={value} onChange={onChange} />
                  </Box>
                )}
              />

              <Controller
                control={control}
                name="name"
                render={({ field: { onBlur, onChange, value } }) => (
                  <FormControl isRequired isInvalid={!!errors.name}>
                    <FormControlLabel className="mb-1.5">
                      <FormControlLabelText className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Name
                      </FormControlLabelText>
                    </FormControlLabel>

                    {/* Neutral, squarish input matching the HomeHeader style */}
                    <Input className="rounded-xl border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <InputField
                        placeholder="Enter Group Name"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        className="text-zinc-900 dark:text-zinc-50"
                      />
                    </Input>

                    <FormControlError className="mt-1.5">
                      <FormControlErrorText className="text-sm text-red-500">
                        {errors.name?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                )}
              />
            </Box>
          </ModalBody>

          <ModalFooter className="flex-row justify-end gap-3 border-t-0 px-4 pb-4">
            <Button
              isDisabled={isFormSubmitting}
              variant="outline"
              size="sm"
              onPress={() => setIsOpen(false)}
              className="rounded-xl border-zinc-200 dark:border-zinc-800">
              <ButtonText className="text-zinc-700 dark:text-zinc-300">Cancel</ButtonText>
            </Button>
            <Button
              isDisabled={isFormSubmitting}
              size="sm"
              onPress={handleSubmit(onSubmit)}
              className="rounded-xl bg-blue-600 dark:bg-blue-600">
              <ButtonText className="text-white">Confirm</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
