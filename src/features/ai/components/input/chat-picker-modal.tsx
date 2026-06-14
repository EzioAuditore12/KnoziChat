import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { cn } from '@gluestack-ui/utils';

import { CloseIcon, Icon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';

import { ChatPickerOption } from './chat-picker-option';
import type { ChatOption } from './types';

interface ChatPickerModalProps {
  chats: ChatOption[];
  isLoadingChats: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedChatId?: string;
  onSelectChat: (chat: ChatOption) => void;
}

export function ChatPickerModal({
  chats,
  isLoadingChats,
  isOpen,
  onClose,
  selectedChatId,
  onSelectChat,
}: ChatPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'group' | 'direct'>('group');

  const filteredChats = chats.filter((chat) => chat.type === activeTab);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop className="bg-zinc-950/50 dark:bg-zinc-950/70" />

      <ModalContent className="w-[92%] max-w-105 rounded-2xl border border-zinc-200 bg-white p-0 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <ModalHeader className="items-start gap-2 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <View className="flex-1 gap-1 pr-3">
            <Heading size="md" className="font-semibold text-zinc-900 dark:text-zinc-50">
              Select Chat
            </Heading>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400">
              Choose the group or direct chat for this message.
            </Text>
          </View>

          <ModalCloseButton>
            <Icon as={CloseIcon} className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </ModalCloseButton>
        </ModalHeader>

        <View className="flex-row border-b border-zinc-200 dark:border-zinc-800">
          <Pressable
            onPress={() => setActiveTab('group')}
            className={cn(
              'flex-1 items-center py-3',
              activeTab === 'group' ? 'border-b-2 border-zinc-900 dark:border-zinc-50' : ''
            )}>
            <Text
              className={cn(
                'text-sm font-medium',
                activeTab === 'group'
                  ? 'text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-500 dark:text-zinc-400'
              )}>
              Groups
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('direct')}
            className={cn(
              'flex-1 items-center py-3',
              activeTab === 'direct' ? 'border-b-2 border-zinc-900 dark:border-zinc-50' : ''
            )}>
            <Text
              className={cn(
                'text-sm font-medium',
                activeTab === 'direct'
                  ? 'text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-500 dark:text-zinc-400'
              )}>
              Direct Chats
            </Text>
          </Pressable>
        </View>

        <ModalBody
          scrollEnabled
          className="max-h-[60vh] px-4 py-4"
          contentContainerClassName="gap-3 pb-1">
          {isLoadingChats ? (
            <View className="items-center justify-center rounded-xl border border-dashed border-zinc-200 px-4 py-6 dark:border-zinc-800">
              <Spinner size="small" />
            </View>
          ) : filteredChats.length ? (
            filteredChats.map((chat) => (
              <ChatPickerOption
                key={chat.id}
                chat={chat}
                isSelected={chat.id === selectedChatId}
                onPress={() => {
                  onSelectChat(chat);
                  onClose();
                }}
              />
            ))
          ) : (
            <View className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 dark:border-zinc-800">
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">No chats available.</Text>
            </View>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
