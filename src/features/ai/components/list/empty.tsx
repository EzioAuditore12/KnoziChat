import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { EditIcon } from '@/components/ui/icon';

interface AiConversationListEmptyProps {
  onPressAnalyze: () => void;
}

export function AiConversationListEmpty({ onPressAnalyze }: AiConversationListEmptyProps) {
  return (
    <Box className="mt-24 flex-1 items-center justify-center gap-4 p-8">
      <Box className="mb-2 rounded-full bg-violet-100 p-6">
        <ButtonIcon as={EditIcon} className="size-12 text-violet-600" />
      </Box>
      <Box>
        <Text className="text-typography-800 text-center text-xl font-bold">
          No AI Analyses yet
        </Text>
      </Box>
      <Text className="text-typography-500 mb-4 text-center text-base">
        Select a chat to begin an AI analysis session.
      </Text>
      <Button onPress={onPressAnalyze} className="rounded-full bg-violet-600 px-6 py-3">
        <ButtonIcon as={EditIcon} className="mr-2 text-white" />
        <ButtonText className="text-white">Analyze a Chat</ButtonText>
      </Button>
    </Box>
  );
}
