import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Center } from '@/components/ui/center';

export function GroupScreenLoading() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <Box style={{ paddingTop: safeAreaInsets.top }} className="min-h-23 p-2">
              <Text>Loading group info</Text>
            </Box>
          ),
        }}
      />

      <Center className="flex-1">
        <Text>Loading all the chats</Text>
      </Center>
    </>
  );
}
