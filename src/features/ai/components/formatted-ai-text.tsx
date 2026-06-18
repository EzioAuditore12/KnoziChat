import { useMemo } from 'react';
import { Linking, useColorScheme } from 'react-native';
import { Markdown } from 'react-native-nitro-markdown';
import type { CustomRenderers } from 'react-native-nitro-markdown';

import { Text } from '@/components/ui/text';
import { Link } from '@/components/native-link';
import { cn } from '@gluestack-ui/utils';
import { useAuthStore } from '@/store/auth';

const MENTION_LINK_OR_UUID_REGEX =
  /(\[.*?\]\(mention:\/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\))|([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/g;

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
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  const processedText = useMemo(() => {
    if (!text) return '';
    // Preserve existing mention links and only wrap raw UUIDs
    return text.replace(MENTION_LINK_OR_UUID_REGEX, (match, existingLink, rawUuid) => {
      if (existingLink) return existingLink;
      if (rawUuid) return `[${rawUuid}](mention://${rawUuid})`;
      return match;
    });
  }, [text]);

  const renderers = useMemo<CustomRenderers>(
    () => ({
      link: ({ href, children }) => {
        if (href.startsWith('mention://')) {
          const uuid = href.replace('mention://', '');

          if (currentUser?.id === uuid) {
            return <Text className={cn('font-medium text-blue-500', className)}>@You</Text>;
          }

          const user = allUsers?.find((u) => u.id === uuid);

          if (user) {
            const chat = directChats?.find((c) => c.userId === uuid);

            if (chat) {
              return (
                <Link
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
                  href={{
                    pathname: '/(main)/chat/new/direct/[id]',
                    params: {
                      id: user.id,
                      name: user.firstName,
                      avatar: user.avatar || '',
                      email: user.email,
                    },
                  }}>
                  <Text className={cn('font-medium text-blue-500', className)}>
                    @{user.username}
                  </Text>
                </Link>
              );
            }
          }

          // Fallback if the user is not found
          return <Text className={className}>{children}</Text>;
        }

        // Default web link behavior
        return (
          <Text
            className={cn('text-blue-500 underline', className)}
            onPress={() => Linking.openURL(href)}>
            {children}
          </Text>
        );
      },
    }),
    [allUsers, className, currentUser?.id, directChats]
  );

  if (!text) return null;

  return (
    <Markdown
      renderers={renderers}
      options={{ gfm: true }}
      theme={{
        colors: {
          text: isDark ? '#f4f4f5' : '#18181b', // zinc-100 / zinc-900
          link: '#3b82f6', // blue-500
        },
      }}>
      {processedText}
    </Markdown>
  );
}
