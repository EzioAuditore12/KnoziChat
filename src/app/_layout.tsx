import '../global.css';

import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { HeroUINativeProvider } from 'heroui-native/provider';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { PowerSyncDatabaseProvider } from '@/db';
import { TanstackReactQueryClientProvider } from '@/lib/tanstack/react-query';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <HeroUINativeProvider
          config={{
            devInfo: {
              stylingPrinciples: false,
            },
          }}
        >
          <KeyboardProvider>
            <PowerSyncDatabaseProvider>
              <TanstackReactQueryClientProvider>
                <Stack initialRouteName="(main)" screenOptions={{ headerShown: false }} />
              </TanstackReactQueryClientProvider>
            </PowerSyncDatabaseProvider>
          </KeyboardProvider>
        </HeroUINativeProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
