import type { Dispatch, SetStateAction } from 'react';

interface MutationHandlerOptions {
  mutate: (options: any) => void;
  setStreamingText: Dispatch<SetStateAction<string>>;
  id: string;
  name?: string;
  isGroup: string;
}

export function createAiMutationHandler({
  mutate,
  setStreamingText,
  id,
  name,
  isGroup,
}: MutationHandlerOptions) {
  return (query: string) => {
    setStreamingText(''); // Reset on new message
    mutate({
      query,
      group: { groupId: id, groupName: name || 'Chat' },
      isGroup: isGroup === 'true',
      onMessage: (text: string) => {
        setStreamingText((prev) => prev + text);
      },
    });
  };
}
