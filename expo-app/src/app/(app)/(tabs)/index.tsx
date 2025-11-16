import { Stack } from 'expo-router';

import { Box } from '@/components/ui/box';

import { Header } from '@/features/app/home/components/header';

import { EnhancedConversationList } from '@/features/app/home/components/conversation-list';

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      <Box className="flex-1 gap-y-2 p-2">
        <EnhancedConversationList />
      </Box>
    </>
  );
}
