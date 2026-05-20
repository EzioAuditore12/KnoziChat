import { Platform } from 'react-native';

import { useVideoPlayer, VideoView, type VideoViewProps } from 'expo-video';

export function ChatDirectVideo({
  uri,
  nativeControls = Platform.OS === 'android' ? false : true,
  allowsPictureInPicture = Platform.OS === 'android' ? false : true,
  style = {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
  ...props
}: Omit<VideoViewProps, 'player'> & { uri?: string | null }) {
  if (!uri) return null;

  return (
    <ChatDirectVideoPlayer
      uri={uri}
      nativeControls={nativeControls}
      allowsPictureInPicture={allowsPictureInPicture}
      style={style}
      {...props}
    />
  );
}

function ChatDirectVideoPlayer({
  uri,
  nativeControls,
  allowsPictureInPicture,
  style,
  ...props
}: Omit<VideoViewProps, 'player'> & { uri: string }) {
  const player = useVideoPlayer({ uri });

  return (
    <VideoView
      player={player}
      style={style}
      allowsPictureInPicture={allowsPictureInPicture}
      nativeControls={nativeControls}
      surfaceType={Platform.OS === 'android' ? 'textureView' : undefined}
      {...props}
    />
  );
}
