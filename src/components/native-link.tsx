import { cn } from '@gluestack-ui/utils';
import { Link as ExpoLink, type LinkProps } from 'expo-router';

export function Link({ className, href, ...props }: LinkProps) {
  return <ExpoLink href={href} className={cn('text-foreground text-base', className)} {...props} />;
}
