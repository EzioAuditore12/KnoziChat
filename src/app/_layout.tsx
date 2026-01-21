import '../../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { useUniwind } from 'uniwind';

import { initializeSyncEngine } from '@/db/sync';
import { registerForPushNotificationsAsync } from '@/lib/notification';
import { NAV_THEME } from '@/lib/theme';
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
  const { theme } = useUniwind();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token && token.length !== 0) {
        useDeviceConfigStore.getState().setExpoPushToken(token);
      }
    });
  }, []);

  useEffect(() => {
    initializeSyncEngine();
  }, []);

  return (
    <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <KeyboardProvider>
        <WatermelondbProvider>
          <TanstackReactQueryClientProvider>
            <Stack initialRouteName="(main)" screenOptions={{ headerShown: false }} />
          </TanstackReactQueryClientProvider>
        </WatermelondbProvider>
      </KeyboardProvider>
      <PortalHost />
    </ThemeProvider>
  );
}
