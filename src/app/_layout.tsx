import '../../global.css';
import 'react-native-url-polyfill';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { SafeAreaListener } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';
import { setLocale } from '@bernagl/react-native-date';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { PowerSyncDatabaseProvider } from '@/db';
import { TanstackReactQueryClientProvider } from '@/lib/tanstack/query';

setLocale('en');

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets);
      }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <KeyboardProvider>
              <PowerSyncDatabaseProvider>
                <TanstackReactQueryClientProvider>
                  <Stack initialRouteName="(main)" screenOptions={{ headerShown: false }} />
                </TanstackReactQueryClientProvider>
              </PowerSyncDatabaseProvider>
            </KeyboardProvider>
            <StatusBar style="auto" />
          </ThemeProvider>
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </SafeAreaListener>
  );
}
