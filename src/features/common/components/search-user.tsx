import type { ComponentProps } from 'react';
import { Input } from 'heroui-native/input';
import { cn } from 'tailwind-variants';

export function SearchUserInput({ className, ...props }: ComponentProps<typeof Input>) {
  return <Input className={cn(className)} {...props} />;
}
