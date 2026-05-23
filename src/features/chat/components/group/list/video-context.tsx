import { createContext, useContext } from 'react';

interface GroupChatVideoPlaybackContextType {
  playingUri: string | null;
  setPlayingUri: (uri: string | null) => void;
}

export const GroupChatVideoPlaybackContext = createContext<GroupChatVideoPlaybackContextType>({
  playingUri: null,
  setPlayingUri: () => {},
});

export const useGroupChatVideoPlayerContext = () => useContext(GroupChatVideoPlaybackContext);
