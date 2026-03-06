import { io, type Socket as SocketType } from 'socket.io-client';

import { env } from '@/env';

import { useAuthStore } from '@/store/auth';
import { handleWsTokenRefresh } from './ws-socket.refresh';

import type { SendMessage } from './schemas/send-message.schema';
import type { ReceiveMessage } from './schemas/receive-message.schema';
import { SendGroupMessage } from './schemas/send-group-message.schema';
import { ReceiveGroupMessage } from './schemas/receive-group-message.schema';

type SocketError = Error & { data?: { status: number } };

export function connectWebSocket() {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  if (!accessToken) {
    throw new Error('No access token available');
  }

  const socket: Socket = io(env.SOCKET_URL, {
    auth: {
      token: accessToken,
    },
    autoConnect: true,
  });

  socket.on('connect_error', (err: SocketError) => handleWsTokenRefresh(err, socket));

  return socket;
}

export interface ServerToClientEvents {
  connect: () => void;
  'online:users': (userIds: string[]) => void;
  'message:receive': (message: ReceiveMessage) => void;
  'message-group:receive': (message: ReceiveGroupMessage) => void;
}

export interface ClientToServerEvents {
  'conversation:join': (conversationId: string) => void;
  'conversation:leave': (conversationId: string) => void;
  'conversation-group:join': (conversationId: string) => void;
  'conversation-group:leave': (conversationId: string) => void;
  'message:send': (dto: SendMessage) => void;
  'message-group:send': (dto: SendGroupMessage) => void;
}

export type Socket = SocketType<ServerToClientEvents, ClientToServerEvents>;
