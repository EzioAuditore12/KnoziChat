import { create } from 'zustand';

import type { SocketState } from './type';

import { connectWebSocket } from '@/lib/socket-io';

export const useSocketState = create<SocketState>()((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const { socket } = get();

    if (socket?.connected) return;

    const newSocket = connectWebSocket();

    set({ socket: newSocket });

    newSocket.on('connect', () => {
      console.log('Socket connected', newSocket.id);
    });

    newSocket.on('online:users', (userIds) => {
      console.log(userIds);

      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();

    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
