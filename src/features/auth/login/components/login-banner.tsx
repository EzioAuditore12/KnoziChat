import LottieView from 'lottie-react-native';
import { useRef, type ComponentProps } from 'react';

import loginBannerAnimation from '../assets/banner.json';

interface LoginBannerProps extends Omit<ComponentProps<typeof LottieView>, 'source'> {
  source?: ComponentProps<typeof LottieView>['source'];
}

export function LoginBanner({ style, source = loginBannerAnimation, ...props }: LoginBannerProps) {
  const animation = useRef<LottieView>(null);
  return (
    <LottieView
      autoPlay={true}
      ref={animation}
      style={[
        {
          width: 250,
          height: 250,
        },
        style,
      ]}
      source={source}
      loop={false}
      {...props}
    />
  );
}
