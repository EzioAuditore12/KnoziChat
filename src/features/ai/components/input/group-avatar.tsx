import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';

export function GroupAvatar({
  name,
  avatar,
  className,
}: {
  name: string;
  avatar?: string | null;
  className?: string;
}) {
  return (
    <Avatar className={className ?? 'h-8 w-8 shrink-0 bg-gray-100 dark:bg-gray-800'}>
      <AvatarImage source={avatar ? { uri: avatar } : undefined} />
      <AvatarFallbackText>{name.slice(0, 1)}</AvatarFallbackText>
    </Avatar>
  );
}
