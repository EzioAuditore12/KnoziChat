import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import type { ComponentProps } from 'react';

interface MediaModifyAlertProps extends ComponentProps<typeof AlertDialog> {
  actionOnDelete?: () => void;
}

export function MediaModifyAlert({
  className,
  isOpen,
  onClose,
  actionOnDelete,
  ...props
}: MediaModifyAlertProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} {...props}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="text-foreground text-lg font-semibold">
            Are you sure you want to remove this attachment?
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-3 mb-4">
          <Text className="text-muted-foreground text-sm">
            Deleting this will remove it permanently and cannot be undone. Please confirm if you
            want to proceed.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant="outline" onPress={onClose}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={() => {
              actionOnDelete?.();
              onClose?.();
            }}
            variant="destructive">
            <ButtonText>Delete</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
