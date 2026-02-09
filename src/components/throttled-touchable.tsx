import { Pressable, type PressableProps } from 'react-native';
import { useThrottledCallback } from 'use-debounce';
import { cn } from 'tailwind-variants';

export interface ThrottledTouchableProps extends PressableProps {
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
