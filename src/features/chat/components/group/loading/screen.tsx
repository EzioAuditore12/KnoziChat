import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';

export function GroupScreenLoading() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <Box style={{ paddingTop: safeAreaInsets.top }} className="min-h-23 justify-center p-2">
              <Spinner size="small" />
            </Box>
          ),
        }}
      />

      <Center className="flex-1">
        <Spinner size="large" />
      </Center>
    </>
  );
}
