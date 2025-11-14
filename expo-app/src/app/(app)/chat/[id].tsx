import { useLocalSearchParams } from 'expo-router';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

export default function ChatScreen() {
  const { id } = useLocalSearchParams() as unknown as { id: string };

  return (
    <Box className="flex-1 items-center justify-center">
      <Text size="4xl">{id}</Text>
    </Box>
  );
}
