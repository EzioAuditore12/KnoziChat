import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Icon, MessageCircleIcon, SearchIcon } from '@/components/ui/icon';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';

export function ConversationListEmpty() {
  return (
    <VStack className="mt-24 flex-1 items-center justify-center gap-4 p-8">
      <View className="mb-2 rounded-full bg-violet-100 p-6">
        <Icon as={MessageCircleIcon} className="size-12 text-violet-600" />
      </View>
      <Heading className="text-typography-800 text-center text-xl font-bold">No chats yet</Heading>
      <Text className="text-typography-500 mb-4 text-center text-base">
        Start a new conversation by searching for users.
      </Text>
      <Button
        onPress={() => router.push('/(main)/search/user')}
        className="rounded-full bg-violet-600 px-6 py-3">
        <ButtonIcon as={SearchIcon} className="mr-2 text-white" />
        <ButtonText className="text-white">Find Users</ButtonText>
      </Button>
    </VStack>
  );
}
