import { Image, type ImageProps } from 'expo-image';

export function ChatGroupImage({
  contentFit = 'cover',
  style = {
    width: 250,
    height: 300,
    borderRadius: 12,
  },
  ...props
}: ImageProps) {
  return <Image contentFit={contentFit} style={style} {...props} />;
}
