import { createContext, useContext } from 'react';

interface VideoPlaybackContextType {
  playingUri: string | null;
  setPlayingUri: (uri: string | null) => void;
}

export const VideoPlaybackContext = createContext<VideoPlaybackContextType>({
  playingUri: null,
  setPlayingUri: () => {},
});

export const useVideoPlayerContext = () => useContext(VideoPlaybackContext);
