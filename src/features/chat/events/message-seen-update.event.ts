import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';

import { chatDirectRepository } from '@/db/repositories/chat-direct.repository';
import { useAuthStore } from '@/store/auth';

const handleMessageSeenUpdate = async ({
  conversationId,
  userId: readUserId,
  lastSeenAt,
}: {
  conversationId: string;
  userId: string;
  lastSeenAt: string | number; // Note: Ensure it fits the type emitted by your gateway
}) => {
  // Get the locally logged-in user's ID
  const currentUserId = useAuthStore.getState().user?.id;

  if (!currentUserId) return;

  // Pass all 4 arguments exactly as your repository defined them
  await chatDirectRepository.updateConversationWatermark(
    conversationId,
    currentUserId,
    readUserId,
    typeof lastSeenAt === 'string' ? new Date(lastSeenAt).getTime() : lastSeenAt
  );
};

export function useMessageSeenUpdateEvent(socket: Socket | null) {
  useEffect(() => {
    if (!socket) return;

    socket.on('message:seen:update', handleMessageSeenUpdate);

    return () => {
      socket.off('message:seen:update', handleMessageSeenUpdate);
    };
  }, [socket]);
}
