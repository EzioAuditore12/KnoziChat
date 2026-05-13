import { create } from 'zustand';
import { AppState, type NativeEventSubscription } from 'react-native';

import type { SocketState } from './type';

import { connectWebSocket } from '@/lib/socket-io';
import { conversationDirectRepository } from '@/db/repositories/conversation-direct.repository';

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

      newSocket.on('connect', async () => {
        console.log('Socket connected', newSocket.id);
        const userIds = await conversationDirectRepository.getUsersWithExistingChats();
        if (userIds.length > 0) {
          newSocket.emit('presence:get', userIds);
        }
      });

      // Ignore global online:users to prevent overwriting contacts' presence state
      newSocket.on('online:users', (userIds) => {
        console.log('Global online users update ignored');
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
