import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ButtonIcon } from '@/components/ui/button';

interface FloatingActionButtonProps {
  icon: any;
  onPress: () => void;
  accessibilityHint?: string;
}

export function FloatingActionButton({
  icon,
  onPress,
  accessibilityHint,
}: FloatingActionButtonProps) {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <Button
      className="absolute right-5"
      size="lg"
      accessibilityHint={accessibilityHint}
      style={{
        bottom: safeAreaInsets.bottom + 20,
        backgroundColor: '#8b5cf6',
        borderRadius: 32,
        padding: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      }}
      onPress={onPress}>
      <ButtonIcon as={icon} color="#fff" size="lg" />
    </Button>
  );
}
