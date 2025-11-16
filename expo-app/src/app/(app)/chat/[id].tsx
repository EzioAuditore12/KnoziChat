import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { EnhancedDirectChatList } from '@/features/app/chat/components/chat-list';
import { SendMessage } from '@/features/app/chat/components/send-message';

export default function ChatScreen() {
  const { id } = useLocalSearchParams() as unknown as { id: string };

  const safeAraeInsets = useSafeAreaInsets();

  return (
    <Box className="flex-1" style={{ marginBottom: safeAraeInsets.bottom }}>
      <EnhancedDirectChatList conversationId={id} />
      <SendMessage onSend={() => console.log('send')} />
    </Box>
  );
}
