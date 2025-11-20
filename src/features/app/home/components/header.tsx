import type { ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { cn } from '@gluestack-ui/utils/nativewind-utils';

import { useAuthStore } from '@/store';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';

export function Header({ className, ...props }: ComponentProps<typeof Box>) {
  const safeAreaInsets = useSafeAreaInsets();

  const logout = useAuthStore((state) => state.logout);

  return (
    <Box
      className={cn(
        'min-h-5 flex-row bg-slate-200 p-2 dark:bg-gray-600',
        className,
      )}
      style={{
        paddingTop: safeAreaInsets.top,
      }}
      {...props}
    >
      <Box>
        <Heading size="3xl">Home</Heading>
      </Box>

      <Box className="ml-auto flex-col gap-y-2">
        <Link className="dark:text-white" href={'/(app)/search'}>
          Search
        </Link>

        <Button className="bg-red-500" onPress={logout}>
          <ButtonText>Logout</ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
