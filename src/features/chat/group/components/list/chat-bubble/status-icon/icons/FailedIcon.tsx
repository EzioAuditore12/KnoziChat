import Svg, { Path } from 'react-native-svg';

export function FailedIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Path d="M18 6L6 18M6 6L18 18" />
    </Svg>
  );
}
