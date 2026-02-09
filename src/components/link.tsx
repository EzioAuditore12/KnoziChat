import { Link as ExpoLink, type LinkProps } from 'expo-router';
import { cn } from 'tailwind-variants';

export function Link({ className, href, ...props }: LinkProps) {
  return <ExpoLink href={href} className={cn('text-foreground text-base', className)} {...props} />;
}
