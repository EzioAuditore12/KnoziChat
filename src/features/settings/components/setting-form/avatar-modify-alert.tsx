import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';

import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

import type { ComponentProps } from 'react';

interface AvatarModifyAlertProps extends ComponentProps<typeof AlertDialog> {
  actionOnEdit?: () => void;
  actionOnDelete?: () => void;
}

export function AvatarModifyAlert({
  isOpen,
  onClose,
  actionOnEdit,
  actionOnDelete,
  ...props
}: AvatarModifyAlertProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} {...props}>
      <AlertDialogBackdrop />

      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="text-foreground text-lg font-semibold">Modify Avatar</Heading>
        </AlertDialogHeader>

        <AlertDialogBody className="mt-3 mb-4">
          <Text className="text-muted-foreground text-sm">
            You can either change your current avatar or remove it completely.
          </Text>
        </AlertDialogBody>

        <AlertDialogFooter className="gap-2">
          <Button variant="outline" onPress={onClose}>
            <ButtonText>Cancel</ButtonText>
          </Button>

          <Button
            variant="outline"
            onPress={() => {
              actionOnEdit?.();
              onClose?.();
            }}>
            <ButtonText>Edit</ButtonText>
          </Button>

          <Button
            variant="destructive"
            onPress={() => {
              actionOnDelete?.();
              onClose?.();
            }}>
            <ButtonText>Delete</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
