import type { ComponentProps } from 'react';
import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { withUniwind } from 'uniwind';
import { cn } from 'tailwind-variants';

const StyledIonicons = withUniwind(ExpoIonicons);

export const Ionicons = ({ className, name, ...props }: ComponentProps<typeof StyledIonicons>) => {
  return (
    <StyledIonicons
      name={name}
      className={cn('text-black dark:text-white', className)}
      {...props}
    />
  );
};
