import Svg, { Path } from 'react-native-svg';

export function TickSingle({ color = '#dbeafe', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.4 19L6.46997 13.07L7.87997 11.66L12.4 16.18L21.57 7.00998L22.99 8.41998L12.4 19Z"
        fill={color}
      />
    </Svg>
  );
}
