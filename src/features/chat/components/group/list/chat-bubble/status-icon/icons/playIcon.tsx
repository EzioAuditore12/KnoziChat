import Svg, { Path } from 'react-native-svg';

export function PlayIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Path d="M5 3l14 9-14 9V3z" />
    </Svg>
  );
}
