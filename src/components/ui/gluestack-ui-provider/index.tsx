import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { Uniwind } from 'uniwind';

import { useDeviceConfigStore } from '@/store/device'; // Adjust import path if needed

export function GluestackUIProvider({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  // Read the theme from Zustand store
  const theme = useDeviceConfigStore((state) => state.theme);

  useEffect(() => {
    Uniwind.setTheme(theme);
  }, [theme]);

  return (
    <View style={[{ flex: 1, height: '100%', width: '100%' }, style]}>
      <OverlayProvider>
        <ToastProvider>{children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
