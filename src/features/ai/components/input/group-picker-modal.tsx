import { Text, View } from 'react-native';

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

import { GroupPickerOption } from './group-picker-option';
import type { GroupOption } from './types';

interface GroupPickerModalProps {
  groups: GroupOption[];
  isLoadingGroups: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedGroupId?: string;
  onSelectGroup: (groupId: string) => void;
}

export function GroupPickerModal({
  groups,
  isLoadingGroups,
  isOpen,
  onClose,
  selectedGroupId,
  onSelectGroup,
}: GroupPickerModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop className="bg-zinc-950/50 dark:bg-zinc-950/70" />

      <ModalContent className="w-[92%] max-w-105 rounded-2xl border border-zinc-200 bg-white p-0 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <ModalHeader className="items-start gap-2 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <View className="flex-1 gap-1 pr-3">
            <Heading size="md" className="font-semibold text-zinc-900 dark:text-zinc-50">
              Select group
            </Heading>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400">
              Choose the group for this message. The list scrolls if there are many groups.
            </Text>
          </View>

          <ModalCloseButton>
            <Icon as={CloseIcon} className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody
          scrollEnabled
          className="max-h-[60vh] px-4 py-4"
          contentContainerClassName="gap-3 pb-1">
          {isLoadingGroups ? (
            <View className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 dark:border-zinc-800">
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Loading groups...</Text>
            </View>
          ) : groups.length ? (
            groups.map((group) => (
              <GroupPickerOption
                key={group.id}
                group={group}
                isSelected={group.id === selectedGroupId}
                onPress={() => {
                  onSelectGroup(group.id);
                  onClose();
                }}
              />
            ))
          ) : (
            <View className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 dark:border-zinc-800">
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">No groups available.</Text>
            </View>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
