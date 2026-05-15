import { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } from 'expo-image-picker';
import { Activity, type ComponentProps, useState } from 'react';
import { cn } from '@gluestack-ui/utils';

import { ThrottledTouchable } from '@/components/throttled-touchable';

import { AvatarModifyAlert } from './avatar-modify-alert';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Icon, RemoveIcon } from '@/components/ui/icon';

import { RegisterFormParam } from '../../schemas/register-form/params.schema';

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

          const permissionResult = await requestMediaLibraryPermissionsAsync();

          if (!permissionResult.granted) {
            alert('Permission required to access the media library is required.');

            return;
          }

          const result = await launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            selectionLimit: 1,
            aspect: [4, 3],
            quality: 1,
          });

          if (result.canceled) return;

          const file = result.assets[0];

          onChange({
            name: file.fileName ?? 'avatar.jpg',
            type: file.mimeType ?? 'image/jpeg',
            uri: file.uri,
          });
        }}>
        <Avatar className={cn('size-20 self-center', className)} {...props}>
          <AvatarImage source={value ? { uri: value.uri } : undefined} />

          <AvatarFallbackText>A</AvatarFallbackText>

          <Activity mode={value ? 'visible' : 'hidden'}>
            <AvatarBadge className="bg-background absolute right-0 bottom-0 size-8 items-center justify-center rounded-full border-none">
              <Icon as={RemoveIcon} className="text-red-500" size="sm" />
            </AvatarBadge>
          </Activity>
        </Avatar>
      </ThrottledTouchable>
    </>
  );
}
