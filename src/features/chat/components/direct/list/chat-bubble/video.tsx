import { Platform } from 'react-native';

import { useVideoPlayer, VideoView, type VideoViewProps } from 'expo-video';
import { useVideoPlayerContext } from '../video-context';
import { useEffect } from 'react';

export function ChatDirectVideo({
  uri,
  nativeControls = true,
  allowsPictureInPicture = true,
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
  const { playingUri, setPlayingUri } = useVideoPlayerContext();

  useEffect(() => {
    // If there is no player, do nothing
    if (!player) return;

    const subscription = player.addListener('playingChange', (event) => {
      if (event.isPlaying) {
        setPlayingUri(uri);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player, uri, setPlayingUri]);

  // 2. Pause THIS video if the context says another video is playing
  useEffect(() => {
    if (playingUri !== uri && player.playing) {
      player.pause();
    }
  }, [playingUri, uri, player]);

  // 👇 ADD A CONDITIONAL RETURN: Only render VideoView if player exists
  if (!player) {
    return null;
  }

  return (
    <VideoView
      // 👇 THE MAGIC FIX: The key forces the native view to tear down and
      // rebuild when the URI changes, preventing the "released object" crash.
      key={uri}
      player={player}
      style={style}
      allowsPictureInPicture={allowsPictureInPicture}
      nativeControls={nativeControls}
      surfaceType={Platform.OS === 'android' ? 'textureView' : undefined}
      {...props}
    />
  );
}
