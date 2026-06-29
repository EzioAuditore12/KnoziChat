import { AntDesign } from '@react-native-vector-icons/ant-design';
import { cn } from 'cnfast';
import type { ComponentProps } from 'react';
import { withUniwind } from 'uniwind';

const StyledAntDesign = withUniwind(AntDesign);

export function AntDesignIcon({ name, className, ...props }: ComponentProps<typeof AntDesign>) {
  return <StyledAntDesign name={name} className={cn('text-base', className)} {...props} />;
}
