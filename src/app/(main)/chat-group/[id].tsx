import { useLocalSearchParams } from 'expo-router';
import { Description } from 'heroui-native/description';
import { View } from 'react-native';

export default function ChattingGroupScreen() {
  const { id } = useLocalSearchParams() as unknown as { id: string };

  return (
    <View className="flex-1 items-center justify-center">
      <Description>Hello {id}</Description>
    </View>
  );
}
