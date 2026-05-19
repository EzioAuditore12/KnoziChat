import { type Socket } from '@/lib/socket-io';

export interface SocketState {
  socket: Socket | null;
  activeConversationId: string | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}
