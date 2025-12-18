import {
  Canvas,
  Group,
  Skia,
  Skottie,
  useClock,
  type CanvasProps,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

import loginBanner from '../assets/banner.json';

const animation = Skia.Skottie.Make(JSON.stringify(loginBanner));

export function LoginBanner({ style, ...props }: CanvasProps) {
  const clock = useClock();

  const frame = useDerivedValue(() => {
    const fps = animation.fps();
    const duration = animation.duration();
    const totalFrames = Math.floor(duration * fps);
    const currentFrame = Math.floor((clock.value / 1000) * fps);
    return currentFrame < totalFrames ? currentFrame : totalFrames - 1;
  });

  return (
    <Canvas style={[{ height: 300, width: 300 }, style]} {...props}>
      <Group transform={[{ scale: 0.29 }]}>
        <Skottie animation={animation} frame={frame} />
      </Group>
    </Canvas>
  );
}
