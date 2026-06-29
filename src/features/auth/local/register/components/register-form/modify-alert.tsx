import { Button } from 'heroui-native/button';
import { Dialog } from 'heroui-native/dialog';
import { View } from 'react-native';

interface AvatarModifyAlertProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  actionOnDelete?: () => void;
}

export function AvatarModifyAlert({
  className,
  isOpen,
  onClose,
  actionOnDelete,
}: AvatarModifyAlertProps) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className={className}>
          <Dialog.Close variant="ghost" />
          <View className="mb-5 gap-1.5">
            <Dialog.Title>Delete avatar?</Dialog.Title>
            <Dialog.Description>
              This will remove it permanently and cannot be undone.
            </Dialog.Description>
          </View>
          <View className="flex-row justify-end gap-3">
            <Button variant="ghost" size="sm" onPress={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              onPress={() => {
                actionOnDelete?.();
                onClose?.();
              }}
            >
              Delete
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
