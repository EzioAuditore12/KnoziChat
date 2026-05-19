import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';

import { chatDirectRepository } from '@/db/repositories/chat-direct.repository';

const handleMessageSeenUpdate = async ({
  messageIds,
}: {
  conversationId: string;
  userId: string;
  messageIds: string[];
}) => {
  await chatDirectRepository.markMessagesAsSeen(messageIds);
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
