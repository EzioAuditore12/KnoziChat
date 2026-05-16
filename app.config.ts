import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'KnoziChat',
  slug: 'KnoziChat',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/images/icon.png',
  scheme: 'knozichat',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: process.env.EXPO_PUBLIC_PACKAGE,
    googleServicesFile: './google-services.json',
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        android: {
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'The app accesses your photos to let you share them with your friends.',
        colors: {
          cropToolbarColor: '#000000',
        },
        dark: {
          colors: {
            cropToolbarColor: '#000000',
          },
        },
      },
    ],
    [
      'react-native-video',
      {
        enableAndroidPictureInPicture: true,
        enableBackgroundAudio: true,
        androidExtensions: {
          useExoplayerDash: true,
          useExoplayerHls: true,
        },
      },
    ],
    'react-native-nitro-fetch',
    'expo-background-task',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: process.env.EXPO_EAS_PROJECT_ID,
    },
  },
});
