import { useState } from 'react';
import { Text, View, type ViewProps } from 'react-native';
import { router } from 'expo-router';
import { Avatar } from 'heroui-native/avatar';
import { Menu, type MenuKey } from 'heroui-native/menu';
import { Separator } from 'heroui-native/separator';
import { cn } from 'tailwind-variants';

import { Ionicons } from '@/components/icon';
import { ThrottledTouchable } from '@/components/throttled-touchable';

import { useAuthStore } from '@/store/auth';
import { useDeviceConfigStore } from '@/store/device';

export function Header({ className, ...props }: ViewProps) {
  const { user } = useAuthStore((state) => state);

  const setAppTheme = useDeviceConfigStore((state) => state.setTheme);

  const savedTheme = useDeviceConfigStore((state) => state.theme);

  const [theme, setTheme] = useState<Set<MenuKey>>(() => new Set([savedTheme]));

  return (
    <View
      className={cn(
        'flex-row items-center rounded-4xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950',
        className
      )}
      {...props}>
      {/* Search */}
      <ThrottledTouchable
        onPress={() => router.push('/search')}
        className="flex-1 flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <View className="items-center justify-center rounded-full bg-white p-2 dark:bg-neutral-800">
          <Ionicons name="search" className="text-xl text-black dark:text-white" />
        </View>

        <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Search chats...
        </Text>
      </ThrottledTouchable>

      {/* Menu */}
      <Menu>
        <Menu.Trigger asChild>
          <ThrottledTouchable className="ml-3 items-center justify-center rounded-2xl bg-neutral-100 p-3 dark:bg-neutral-900">
            <Ionicons name="menu" className="text-2xl text-black dark:text-white" />
          </ThrottledTouchable>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Overlay />

          <Menu.Content
            presentation="popover"
            width={240}
            className="rounded-3xl border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-950">
            {/* Actions */}
            <Menu.Label className="px-3 pt-1 pb-2 text-xs font-semibold text-neutral-400 uppercase dark:text-neutral-500">
              Quick Actions
            </Menu.Label>

            <Menu.Item id="search" onPress={() => router.push('/search')} className="rounded-2xl">
              <View className="flex-row items-center gap-3 px-2 py-1">
                <Ionicons name="person-add" className="text-xl text-black dark:text-white" />

                <Menu.ItemTitle className="font-medium text-black dark:text-white">
                  Search People
                </Menu.ItemTitle>
              </View>
            </Menu.Item>

            <Menu.Item
              id="create-group"
              onPress={() => router.push('/(main)/new-chat-group')}
              className="rounded-2xl">
              <View className="flex-row items-center gap-3 px-2 py-1">
                <Ionicons name="people" className="text-xl text-black dark:text-white" />

                <Menu.ItemTitle className="font-medium text-black dark:text-white">
                  Create Group
                </Menu.ItemTitle>
              </View>
            </Menu.Item>

            <Menu.Item
              id="settings"
              onPress={() => router.push('/(main)/settings')}
              className="rounded-2xl">
              <View className="flex-row items-center gap-3 px-2 py-1">
                <Ionicons name="settings" className="text-xl text-black dark:text-white" />

                <Menu.ItemTitle className="font-medium text-black dark:text-white">
                  Settings
                </Menu.ItemTitle>
              </View>
            </Menu.Item>

            <Separator className="my-2 bg-neutral-200 dark:bg-neutral-800" />

            {/* Theme */}
            <Menu.Label className="px-3 pt-1 pb-2 text-xs font-semibold text-neutral-400 uppercase dark:text-neutral-500">
              Appearance
            </Menu.Label>

            <Menu.Group
              selectionMode="single"
              selectedKeys={theme}
              onSelectionChange={(keys) => {
                setTheme(keys);

                const value = Array.from(keys)[0] as 'light' | 'dark' | 'system';

                setAppTheme(value);
              }}>
              <Menu.Item id="light" className="rounded-2xl">
                <View className="flex-row items-center gap-3 px-2 py-1">
                  <Ionicons name="sunny" className="text-xl text-yellow-500" />

                  <Menu.ItemTitle className="font-medium text-black dark:text-white">
                    Light
                  </Menu.ItemTitle>

                  <View className="ml-auto">
                    <Menu.ItemIndicator />
                  </View>
                </View>
              </Menu.Item>

              <Menu.Item id="dark" className="rounded-2xl">
                <View className="flex-row items-center gap-3 px-2 py-1">
                  <Ionicons name="moon" className="text-xl text-blue-400" />

                  <Menu.ItemTitle className="font-medium text-black dark:text-white">
                    Dark
                  </Menu.ItemTitle>

                  <View className="ml-auto">
                    <Menu.ItemIndicator />
                  </View>
                </View>
              </Menu.Item>

              <Menu.Item id="system" className="rounded-2xl">
                <View className="flex-row items-center gap-3 px-2 py-1">
                  <Ionicons
                    name="phone-portrait"
                    className="text-xl text-neutral-700 dark:text-neutral-300"
                  />

                  <Menu.ItemTitle className="font-medium text-black dark:text-white">
                    System
                  </Menu.ItemTitle>

                  <View className="ml-auto">
                    <Menu.ItemIndicator />
                  </View>
                </View>
              </Menu.Item>
            </Menu.Group>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* Profile */}
      <ThrottledTouchable onPress={() => router.push('/settings')} className="ml-3">
        <View className="rounded-full border-2 border-neutral-200 p-0.5 dark:border-neutral-700">
          <Avatar className="size-12" alt={user?.firstName ?? ''}>
            <Avatar.Image source={user?.avatar ? { uri: user.avatar } : undefined} />

            <Avatar.Fallback>{user?.firstName?.[0] ?? '?'}</Avatar.Fallback>
          </Avatar>
        </View>
      </ThrottledTouchable>
    </View>
  );
}
