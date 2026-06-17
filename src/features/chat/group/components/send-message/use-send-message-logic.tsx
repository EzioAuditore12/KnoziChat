import crypto from 'react-native-nitro-crypto';
import { useState } from 'react';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';

export function useSwipeReplyTip(onFocus?: () => boolean | void) {
  const toast = useToast();
  const [toastId, setToastId] = useState<string>('0');

  const handleFocus = () => {
    const didDeselect = onFocus?.();

    if (didDeselect && !toast.isActive(toastId)) {
      const newId = Math.random().toString();
      setToastId(newId);

      toast.show({
        id: newId,
        placement: 'top',
        duration: 3000,
        render: ({ id: toastRenderingId }) => {
          const uniqueToastId = 'toast-' + toastRenderingId;
          return (
            <Toast nativeID={uniqueToastId} action="muted" variant="solid">
              <ToastTitle>Tip</ToastTitle>
              <ToastDescription>You can swipe right on a message to reply to it!</ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  return handleFocus;
}

export function useEmptyMessageToast() {
  const toast = useToast();

  const showEmptyMessageToast = () => {
    const newId = crypto.randomInt.toString();

    toast.show({
      id: newId,
      placement: 'top',
      duration: 2000,
      render: ({ id: toastRenderingId }) => {
        const uniqueToastId = 'toast-' + toastRenderingId;
        return (
          <Toast nativeID={uniqueToastId} action="muted" variant="solid">
            <ToastTitle>Cannot send empty message</ToastTitle>
            <ToastDescription>Type a message or attach a file.</ToastDescription>
          </Toast>
        );
      },
    });
  };

  return showEmptyMessageToast;
}
