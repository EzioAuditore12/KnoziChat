import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

type TickDoubleProps = {
  size?: number;
  colorStart?: string;
  colorEnd?: string;
};

export function TickDouble({
  size = 20,
  colorStart = '#53bdeb',
  colorEnd = '#34B7F1',
}: TickDoubleProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="tickGradient" x1="0" y1="0" x2="24" y2="24">
          <Stop offset="0%" stopColor={colorStart} />
          <Stop offset="100%" stopColor={colorEnd} />
        </LinearGradient>
      </Defs>

      {/* Back Tick (Left) */}
      <Path
        d="M1.5 13.5L6.5 18.5L15 9"
        stroke="url(#tickGradient)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Front Tick (Right) */}
      <Path
        d="M8.5 13.5L13.5 18.5L23 8"
        stroke="url(#tickGradient)"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
