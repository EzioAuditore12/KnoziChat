import { io, type Socket as SocketType } from 'socket.io-client';

import { env } from '@/env';

import { useAuthStore } from '@/store/auth';
import { handleWsTokenRefresh } from './ws-socket.refresh';

type SocketError = Error & { data?: { status: number } };

export function connectWebSocket() {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  if (!accessToken) {
    throw new Error('No access token available');
  }

  // Pass the generic types here
  const socket: Socket = io(env.SOCKET_URL, {
    auth: {
      token: accessToken,
    },
    autoConnect: true,
  });

  socket.on('connect_error', (err: SocketError) => handleWsTokenRefresh(err, socket));

  return socket;
}

interface events {
  connect: string;
}

export type Socket = SocketType<events>;
