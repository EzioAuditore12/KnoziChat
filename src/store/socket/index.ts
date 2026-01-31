import { create } from 'zustand';
import { AppState, type NativeEventSubscription } from 'react-native';

import type { SocketState } from './type';

import { connectWebSocket } from '@/lib/socket-io';

// Keep track of the subscription outside the store scope
let appStateSubscription: NativeEventSubscription | null = null;

export const useSocketState = create<SocketState>()((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const { socket } = get();

    if (socket?.connected) return;

    try {
      const newSocket = connectWebSocket();

      set({ socket: newSocket });

      newSocket.on('connect', () => {
        console.log('Socket connected', newSocket.id);
      });

      newSocket.on('online:users', (userIds) => {
        console.log(userIds);

        set({ onlineUsers: userIds });
      });

      // Initialize AppState listener once
      if (!appStateSubscription) {
        appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
          if (nextAppState.match(/inactive|background/)) {
            get().disconnectSocket();
          } else if (nextAppState === 'active') {
            get().connectSocket();
          }
        });
      }
    } catch (error) {
      console.log('Socket connection failed (likely no token):', error);
    }
  },
  disconnectSocket: () => {
    const { socket } = get();

    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
