import { HeroUINativeProvider, type HeroUINativeConfig } from 'heroui-native/provider';
import type { PropsWithChildren } from 'react';
import { useUniwind } from 'uniwind';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

const config: HeroUINativeConfig = {
  textProps: {
    // Disable font scaling for accessibility
    allowFontScaling: false,
    // Auto-adjust font size to fit container
    adjustsFontSizeToFit: false,
    // Maximum font size multiplier when scaling
    maxFontSizeMultiplier: 1.5,
    // Minimum font scale (iOS only, 0.01-1.0)
    minimumFontScale: 0.5,
  },
  devInfo: {
    stylingPrinciples: false,
  },
};

export function HeroUIThemeProvider({ children }: PropsWithChildren) {
  const { theme } = useUniwind();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HeroUINativeProvider config={config}>{children}</HeroUINativeProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
