import { View } from 'react-native';

import { UserProfile } from '@/features/common/components/user-profile';
import { useGetProfile } from '@/features/settings/hooks/queries/use-get-profile';

export default function SettingsScreen() {
  const { data } = useGetProfile();

  return (
    <View className="flex-1 items-center justify-center p-2">
      <UserProfile className="w-full" data={data} />
    </View>
  );
}
