import { create } from 'zustand';
import { AppState, type NativeEventSubscription } from 'react-native';

import type { SocketState } from './type';
import { connectWebSocket } from '@/lib/socket-io';

// Keep this outside, but we will initialize it safely below
let appStateSubscription: NativeEventSubscription | null = null;

export const useSocketState = create<SocketState>()((set, get) => ({
  socket: null,
  onlineUsers: [],
  activeConversationId: null,

  setActiveConversationId: (id) => {
    set({ activeConversationId: id });
  },

  connectSocket: () => {
    const { socket } = get();

    // Prevent duplicate connections if already connected or connecting
    if (socket?.connected) return;

    try {
      const newSocket = connectWebSocket();

      set({ socket: newSocket });

      newSocket.on('connect', () => {
        console.log('Socket connected', newSocket.id);
      });

      newSocket.on('online:users', (keys: string[]) => {
        set({ onlineUsers: keys });
      });

      newSocket.on('presence:list', (statuses) => {
        const { onlineUsers } = get();
        const nextUsers = new Set(onlineUsers);

        statuses.forEach((s) => {
          if (s.online) nextUsers.add(s.userId);
          else nextUsers.delete(s.userId);
        });

        set({ onlineUsers: Array.from(nextUsers) });
      });

      newSocket.on('presence:update', (status) => {
        const { onlineUsers } = get();
        const nextUsers = new Set(onlineUsers);

        if (status.online) nextUsers.add(status.userId);
        else nextUsers.delete(status.userId);

        set({ onlineUsers: Array.from(nextUsers) });
      });
    } catch (error) {
      console.log('Socket connection failed (likely no token):', error);
    }
  },

  disconnectSocket: () => {
    const { socket } = get();

    if (socket) {
      // 1. Remove all listeners so they don't fire ghost events
      socket.removeAllListeners();
      // 2. Disconnect the socket
      socket.disconnect();

      set({ socket: null });
    }
  },
}));

// ==========================================
// App State Management (Foreground/Background)
// ==========================================
// We set this up outside the store so it only ever registers ONCE,
// even if you call connectSocket() multiple times.
if (!appStateSubscription) {
  appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
    const { connectSocket, disconnectSocket } = useSocketState.getState();

    if (nextAppState.match(/inactive|background/)) {
      console.log('App moved to background, disconnecting socket...');
      disconnectSocket();
    } else if (nextAppState === 'active') {
      console.log('App moved to foreground, connecting socket...');
      connectSocket();
    }
  });
}
