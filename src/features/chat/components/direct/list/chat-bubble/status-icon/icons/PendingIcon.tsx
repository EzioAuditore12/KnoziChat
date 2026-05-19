import Svg, { Path } from 'react-native-svg';

export function PendingIcon({ color = '#dbeafe', size = 16 }: { color?: string; size?: number }) {
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
      <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <Path d="M12 6v6l4 2" />
    </Svg>
  );
}
