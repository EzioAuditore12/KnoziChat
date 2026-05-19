import { useVideoPlayer, VideoView, type VideoViewProps } from 'expo-video';

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
}: VideoViewProps & { uri: string }) {
  const player = useVideoPlayer({
    uri,
  });

  return (
    <VideoView
      player={player}
      style={style}
      allowsPictureInPicture={allowsPictureInPicture}
      nativeControls={nativeControls}
      {...props}
    />
  );
}
