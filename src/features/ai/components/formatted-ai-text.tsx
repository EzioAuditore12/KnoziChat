import React from 'react';
import { Text } from '@/components/ui/text';
import { Link } from '@/components/native-link';
import { cn } from '@gluestack-ui/utils';
import { useAuthStore } from '@/store/auth';

const UUID_REGEX = /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/g;

interface FormattedAiTextProps {
  text: string;
  directChats?: any[];
  allUsers?: any[];
  className?: string;
}

export function FormattedAiText({
  text,
  directChats = [],
  allUsers = [],
  className,
}: FormattedAiTextProps) {
  const currentUser = useAuthStore((state) => state.user);

  if (!text) return null;

  const parts = text.split(UUID_REGEX);

  return (
    <Text className={className}>
      {parts.map((part, index) => {
        if (part.match(UUID_REGEX)) {
          if (currentUser?.id === part) {
            return (
              <Text key={index} className={cn('font-medium text-blue-500', className)}>
                @You
              </Text>
            );
          }

          const user = allUsers?.find((u) => u.id === part);

          if (user) {
            const chat = directChats?.find((c) => c.userId === part);

            if (chat) {
              return (
                <Link
                  key={index}
                  href={{
                    pathname: '/(main)/chat/direct/[id]',
                    params: { id: chat.id, userId: chat.userId },
                  }}>
                  <Text className={cn('font-medium text-blue-500', className)}>
                    @{user.username}
                  </Text>
                </Link>
              );
            } else {
              return (
                <Link
                  key={index}
                  href={{
                    pathname: '/(main)/chat/new/direct/[id]',
                    params: { id: user.id, name: user.firstName },
                  }}>
                  <Text className={cn('font-medium text-blue-500', className)}>
                    @{user.username}
                  </Text>
                </Link>
              );
            }
          }
          // Fallback if the user is not found in the local database
          return (
            <Text key={index} className={className}>
              {part}
            </Text>
          );
        }
        return (
          <Text key={index} className={className}>
            {part}
          </Text>
        );
      })}
    </Text>
  );
}
