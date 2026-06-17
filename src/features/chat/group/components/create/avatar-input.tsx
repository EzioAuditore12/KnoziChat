import { openPicker, type Config } from '@baronha/react-native-multiple-image-picker';
import { Activity, type ComponentProps, useState } from 'react';
import { cn } from '@gluestack-ui/utils';

import { ThrottledTouchable } from '@/components/throttled-touchable';

import { AvatarModifyAlert } from '@/features/auth/register/components/register-form/avatar-modify-alert';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Icon, RemoveIcon } from '@/components/ui/icon';

import type { InitializeGroupChatParam } from '@/features/chat/group/schemas/initialize-group-chat/param.schema';

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
  value: InitializeGroupChatParam['avatar'] | undefined;
  onChange: (data: InitializeGroupChatParam['avatar'] | undefined) => void;
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
