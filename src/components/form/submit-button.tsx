import { Button, type ButtonRootProps } from 'heroui-native/button';
import { Spinner } from 'heroui-native/spinner';
import { cn } from 'heroui-native/utils';
import { Activity } from 'react';

import { useFormContext } from '@/lib/tanstack/form';

export const SubmitButton = ({ className, children, ...props }: ButtonRootProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          className={cn('flex-row items-center justify-center gap-x-2', className)}
          isDisabled={isSubmitting}
          onPress={form.handleSubmit}
          {...props}
        >
          <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
            <Spinner className="text-white" />
          </Activity>
          {typeof children === 'string' ? <Button.Label>{children}</Button.Label> : children}
        </Button>
      )}
    </form.Subscribe>
  );
};
