import '../../global.css';

import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

import { registerForPushNotificationsAsync } from '@/lib/notification';
import { HeroUIThemeProvider } from '@/lib/theme';
import { TanstackReactQueryClientProvider } from '@/providers/tanstak-query-client.provider';
import { WatermelondbProvider } from '@/providers/watermelon-db.provider';
import { useDeviceConfigStore } from '@/store/device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token && token.length !== 0) {
        useDeviceConfigStore.getState().setExpoPushToken(token);
      }
    });
  }, []);

  return (
    <HeroUIThemeProvider>
      <KeyboardProvider>
        <WatermelondbProvider>
          <TanstackReactQueryClientProvider>
            <Stack initialRouteName="(main)" screenOptions={{ headerShown: false }} />
          </TanstackReactQueryClientProvider>
        </WatermelondbProvider>
      </KeyboardProvider>
    </HeroUIThemeProvider>
  );
}
