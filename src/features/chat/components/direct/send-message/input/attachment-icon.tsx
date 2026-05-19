import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

type AttachmentFileIconProps = {
  size?: number;
  colorStart?: string;
  colorEnd?: string;
};

export function AttachmentFileIcon({
  size = 24,
  colorStart = '#60a5fa',
  colorEnd = '#2563eb',
}: AttachmentFileIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="fileGradient" x1="0" y1="0" x2="24" y2="24">
          <Stop offset="0%" stopColor={colorStart} />
          <Stop offset="100%" stopColor={colorEnd} />
        </LinearGradient>
      </Defs>

      {/* File Body */}
      <Rect x="5" y="3" width="14" height="18" rx="3" stroke="url(#fileGradient)" strokeWidth="2" />

      {/* Fold Corner */}
      <Path
        d="M15 3V7H19"
        stroke="url(#fileGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Attachment Clip */}
      <Path
        d="M9 13.5L12.5 10C13.3 9.2 14.6 9.2 15.4 10C16.2 10.8 16.2 12.1 15.4 12.9L11.2 17.1C9.9 18.4 7.8 18.4 6.5 17.1C5.2 15.8 5.2 13.7 6.5 12.4L11 7.9"
        stroke="url(#fileGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
