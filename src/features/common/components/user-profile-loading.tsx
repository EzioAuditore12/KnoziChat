import { SkeletonGroup, SkeletonGroupRootProps } from 'heroui-native/skeleton-group';
import { Card } from 'heroui-native/card';
import { View } from 'react-native';
import { Avatar } from 'heroui-native/avatar';
import { Description } from 'heroui-native/description';
import { cn } from 'tailwind-variants';

export function UserProfileLoading({ className, ...props }: SkeletonGroupRootProps) {
  return (
    <SkeletonGroup className={cn(className)} {...props}>
      <Card className="p-4">
        <Card.Header>
          <View className="mb-4 flex-row items-center gap-3">
            <SkeletonGroup.Item className="h-10 w-10 rounded-full">
              <Avatar size="sm" alt="Avatar">
                <Avatar.Image source={{ uri: 'https://i.pravatar.cc/150?img=4' }} />
                <Avatar.Fallback />
              </Avatar>
            </SkeletonGroup.Item>
            <View className="flex-1 gap-1">
              <SkeletonGroup.Item className="h-3 w-32 rounded-md">
                <Description className="text-foreground font-semibold">John Doe</Description>
              </SkeletonGroup.Item>
              <SkeletonGroup.Item className="h-3 w-24 rounded-md">
                <Description className="text-muted text-sm">@johndoe</Description>
              </SkeletonGroup.Item>
            </View>
          </View>
          <View className="mb-4 gap-1.5">
            <SkeletonGroup.Item className="h-4 w-full rounded-md">
              <Description className="text-foreground text-base">
                This is the first line of the post content.
              </Description>
            </SkeletonGroup.Item>
            <SkeletonGroup.Item className="h-4 w-full rounded-md">
              <Description className="text-foreground text-base">
                Second line with more interesting content to read.
              </Description>
            </SkeletonGroup.Item>
            <SkeletonGroup.Item className="h-4 w-2/3 rounded-md">
              <Description className="text-foreground text-base">Last line is shorter.</Description>
            </SkeletonGroup.Item>
          </View>
        </Card.Header>
        <SkeletonGroup.Item className="h-48 w-full rounded-lg">
          <View className="bg-surface-tertiary h-48 overflow-hidden rounded-lg" />
        </SkeletonGroup.Item>
      </Card>
    </SkeletonGroup>
  );
}
