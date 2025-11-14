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
import { WaterMelonDBProvider } from '@/db';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode="system">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <WaterMelonDBProvider>
          <TanstackReactQueryClientProvider>
            <Stack
              initialRouteName="(app)"
              screenOptions={{ headerShown: false }}
            />
          </TanstackReactQueryClientProvider>
        </WaterMelonDBProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
