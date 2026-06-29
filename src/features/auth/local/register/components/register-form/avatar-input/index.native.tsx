import { openPicker, type Config } from '@baronha/react-native-multiple-image-picker';
import { cn } from 'cnfast';
import { Avatar } from 'heroui-native/avatar';
import { Activity, useState, type ComponentProps } from 'react';
import { View } from 'react-native';

import { AntDesignIcon } from '@/components/icon';
import { ThrottledTouchable } from '@/components/throttled-touchable';
import { RegisterFormParam } from '../../../schemas/register-form/params.schema';
import { AvatarModifyAlert } from '../modify-alert';

const config: Config = {
  maxSelect: 1,
  allowedLimit: false,
  primaryColor: '#FB9300',
  backgroundDark: '#2f2f2f',
  numberOfColumn: 4,
  mediaType: 'image',
  selectBoxStyle: 'number',
  selectMode: 'single',
  crop: true,
  language: 'en',
  theme: 'system',
  isHiddenOriginalButton: false,
  presentation: 'formSheet',
};

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

          const result = await openPicker(config);

          if (result.length === 0 || undefined) return;

          const file = result[0];

          onChange({
            name: file.fileName ?? 'avatar.jpg',
            type: file.mime ?? 'image/jpeg',
            uri: file.path,
          });
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
