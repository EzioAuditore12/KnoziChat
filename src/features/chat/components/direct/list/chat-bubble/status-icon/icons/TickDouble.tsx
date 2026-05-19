import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

type TickDoubleProps = {
  size?: number;
  colorStart?: string;
  colorEnd?: string;
};

export function TickDouble({
  size = 18,
  colorStart = '#60a5fa',
  colorEnd = '#2563eb',
}: TickDoubleProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="tickGradient" x1="0" y1="0" x2="24" y2="24">
          <Stop offset="0%" stopColor={colorStart} />
          <Stop offset="100%" stopColor={colorEnd} />
        </LinearGradient>
      </Defs>

      {/* Back Tick */}
      <Path
        d="M2.5 12.5L7.5 17.5L17 8"
        stroke="url(#tickGradient)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.65}
      />

      {/* Front Tick */}
      <Path
        d="M7 12.5L12 17.5L22 7.5"
        stroke="url(#tickGradient)"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
