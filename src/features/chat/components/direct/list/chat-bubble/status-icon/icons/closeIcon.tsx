import Svg, { Path } from 'react-native-svg';

export function CloseIcon({
  size = 16,
  color = 'currentColor',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Path d="M18 6L6 18M6 6L18 18" />
    </Svg>
  );
}
