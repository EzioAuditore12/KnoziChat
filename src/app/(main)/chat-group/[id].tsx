import { GroupInfo } from '@/features/chat/components/group/group-info';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Description } from 'heroui-native/description';
import { View } from 'react-native';

export default function ChattingGroupScreen() {
  const { id } = useLocalSearchParams() as unknown as { id: string };

  return (
    <>
      <Stack.Screen options={{ header: () => <GroupInfo id={id} /> }} />
      <View className="flex-1 items-center justify-center">
        <Description>Hello {id}</Description>
      </View>
    </>
  );
}
