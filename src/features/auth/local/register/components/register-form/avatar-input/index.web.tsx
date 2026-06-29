import { cn } from 'cnfast';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'heroui-native/avatar';
import { Activity, useState, type ComponentProps } from 'react';
import { View } from 'react-native';

import { AntDesignIcon } from '@/components/icon';
import { ThrottledTouchable } from '@/components/throttled-touchable';
import { RegisterFormParam } from '../../../schemas/register-form/params.schema';
import { AvatarModifyAlert } from '../modify-alert';

interface AvatarInputProps extends ComponentProps<typeof Avatar> {
  value: RegisterFormParam['avatar'] | undefined;
  onChange: (data: RegisterFormParam['avatar'] | undefined) => void;
}

export function AvatarInput({ className, value, onChange, ...props }: AvatarInputProps) {
  const [isAvatarModifyOpen, setIsAvatarModifyOpen] = useState(false);

  return (
    <>
      <AvatarModifyAlert
        isOpen={isAvatarModifyOpen}
        onClose={() => setIsAvatarModifyOpen(false)}
        actionOnDelete={() => onChange(undefined)}
      />

      <ThrottledTouchable
        onPress={async () => {
          // SHOW ALERT ONLY WHEN AVATAR EXISTS
          if (value !== undefined) {
            setIsAvatarModifyOpen(true);
            return;
          }

          const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

          if (!permissionResult.granted) {
            // Silently return or we could show an alert, but usually web handles it or just returns granted.
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            onChange({
              name: asset.fileName ?? 'avatar.jpg',
              type: asset.mimeType ?? 'image/jpeg',
              uri: asset.uri,
            });
          }
        }}
      >
        <Avatar className={cn('size-20 self-center', className)} {...props}>
          {value && <Avatar.Image source={{ uri: value.uri }} />}

          <Avatar.Fallback>A</Avatar.Fallback>

          <Activity mode={value ? 'visible' : 'hidden'}>
            <View className="bg-background absolute right-0 bottom-0 size-8 items-center justify-center rounded-full border-none">
              <AntDesignIcon name="delete" className="text-red-500" size={14} />
            </View>
          </Activity>
        </Avatar>
      </ThrottledTouchable>
    </>
  );
}
