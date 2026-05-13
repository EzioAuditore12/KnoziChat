import { cn } from '@gluestack-ui/utils';
import type { ComponentProps } from 'react';
import { useThrottledCallback } from 'use-debounce';

import { Pressable } from '@/components/ui/pressable';

export interface ThrottledTouchableProps extends ComponentProps<typeof Pressable> {
  throttleDelay?: number;
}
export function ThrottledTouchable({
  children,
  className,
  onPress,
  throttleDelay = 1000,
  ...props
}: ThrottledTouchableProps) {
  // Create a throttled version of the onPress handler
  const handlePress = useThrottledCallback(
    (event) => {
      if (onPress) {
        onPress(event);
      }
    },
    throttleDelay,
    {
      leading: true, // Execute immediately on first press
      trailing: false, // Do not execute again after the delay
    }
  );

  return (
    <Pressable className={cn('active:opacity-70', className)} onPress={handlePress} {...props}>
      {children}
    </Pressable>
  );
}
