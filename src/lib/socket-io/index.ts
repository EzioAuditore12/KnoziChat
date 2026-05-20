import { io, type Socket as SocketType } from 'socket.io-client';

import { env } from '@/env';

import { useAuthStore } from '@/store/auth';
import { handleWsTokenRefresh } from './ws-socket.refresh';

import type { SendMessage } from './schemas/send-message.schema';
import type { ReceiveMessage } from './schemas/receive-message.schema';
import { SendGroupMessage } from './schemas/send-group-message.schema';
import { ReceiveGroupMessage } from './schemas/receive-group-message.schema';
import { ReceiveGroupCreated } from './schemas/receive-group-created.schema';

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
  'presence:list': (users: { userId: string; online: boolean }[]) => void;
  'presence:update': (user: { userId: string; online: boolean }) => void;
  'message:receive': (message: ReceiveMessage) => void;
  'message:seen:update': (payload: {
    conversationId: string;
    userId: string;
    lastSeenAt: string; // The ISODate string coming from the backend
  }) => void;
  'message-group:receive': (message: ReceiveGroupMessage) => void;
  'conversation-group:created': (message: ReceiveGroupCreated) => void;
  typing: (payload: { senderId: string; isTyping: boolean }) => void;
  'typing:group': (payload: { senderId: string; isTyping: boolean }) => void;
}

export interface ClientToServerEvents {
  'conversation:join': (conversationId: string) => void;
  'presence:get': (userIds: string[]) => void;
  'conversation:leave': (conversationId: string) => void;
  'conversation-group:join': (conversationId: string) => void;
  'conversation-group:leave': (conversationId: string) => void;
  'message:send': (
    dto: SendMessage,
    callback: (response: { success: boolean; messageId: string }) => void
  ) => void;
  'message:seen': (payload: { conversationId: string }) => void;
  'message-group:send': (dto: SendGroupMessage) => void;
  'conversation:typing': (payload: { conversationId: string; isTyping: boolean }) => void;
  'conversation-group:typing': (payload: { conversationId: string; isTyping: boolean }) => void;
}

export type Socket = SocketType<ServerToClientEvents, ClientToServerEvents>;
