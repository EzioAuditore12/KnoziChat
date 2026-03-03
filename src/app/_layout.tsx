import '../../global.css';

import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

import { registerForPushNotificationsAsync } from '@/lib/notification';

import { HeroUIThemeProvider } from '@/lib/theme';
import { TanstackReactQueryClientProvider } from '@/lib/tanstack/query';

import { useDeviceConfigStore } from '@/store/device';
import { PowerSyncDatabaseProvider } from '@/db';

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
        <PowerSyncDatabaseProvider>
          <TanstackReactQueryClientProvider>
            <Stack initialRouteName="(main)" screenOptions={{ headerShown: false }} />
          </TanstackReactQueryClientProvider>
        </PowerSyncDatabaseProvider>
      </KeyboardProvider>
    </HeroUIThemeProvider>
  );
}
