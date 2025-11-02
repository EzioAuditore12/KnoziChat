import '@/global.css';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { TanstackReactQueryClientProvider } from '@/providers/tanstack-query-client.provider';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { RealmDBProvider } from '@/providers/realm.provider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode="system">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RealmDBProvider>
          <TanstackReactQueryClientProvider>
            <Stack
              initialRouteName="(app)"
              screenOptions={{ headerShown: false }}
            />
          </TanstackReactQueryClientProvider>
        </RealmDBProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
