import { cn } from '@gluestack-ui/utils';
import { router } from 'expo-router';
import { Activity, useState, type ComponentProps } from 'react';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import {
  AddIcon,
  CheckIcon,
  Icon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
} from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '@/components/ui/menu';
import { Text } from '@/components/ui/text';

import { ThrottledTouchable } from '@/components/throttled-touchable';

import { useAuthStore } from '@/store/auth';
import { useDeviceConfigStore } from '@/store/device';

export function HomeHeader({ className, ...props }: ComponentProps<typeof Box>) {
  const { user } = useAuthStore((state) => state);

  const setAppTheme = useDeviceConfigStore((state) => state.setTheme);
  const savedTheme = useDeviceConfigStore((state) => state.theme);
  const [theme, setTheme] = useState(savedTheme);

  return (
    <Box
      className={cn(
        // Added `rounded-b-3xl` for beautiful bottom corners
        'flex-row items-center gap-3 rounded-b-3xl border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-900 dark:bg-zinc-950',
        className
      )}
      {...props}>
      {/* Taller, Squarish Search Input - Increased padding to py-4 */}
      <ThrottledTouchable
        onPress={() => router.push('/(main)/search/chat')}
        className="flex-1 flex-row items-center gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <Center>
          <Icon as={SearchIcon} className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
        </Center>
        <Text size="sm" className="font-medium text-zinc-500 dark:text-zinc-400">
          Search chats...
        </Text>
      </ThrottledTouchable>

      {/* Squarish Menu Dropdown Trigger - Matches Input */}
      <Menu
        placement="bottom right"
        offset={8}
        trigger={({ ...triggerProps }) => {
          return (
            <ThrottledTouchable
              {...triggerProps}
              className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 shadow-sm active:opacity-70 dark:border-zinc-800 dark:bg-zinc-900/50">
              <Icon as={MenuIcon} className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </ThrottledTouchable>
          );
        }}>
        {/* Actions - Removed typography utility classes */}
        <MenuItem
          key="search"
          textValue="Search People"
          onPress={() => router.push('/(main)/search/user')}
          className="rounded-2xl px-4 py-3.5">
          <Icon as={AddIcon} className="mr-3 h-5 w-5" />
          <MenuItemLabel className="text-sm font-medium">Search People</MenuItemLabel>
        </MenuItem>

        <MenuItem
          key="group"
          textValue="Create Group"
          onPress={() => router.push('/(main)/chat/new/group')}
          className="rounded-2xl px-4 py-3.5">
          <Icon as={AddIcon} className="mr-3 h-5 w-5" />
          <MenuItemLabel className="text-sm font-medium">Create Group</MenuItemLabel>
        </MenuItem>

        <MenuItem
          key="settings"
          textValue="Settings"
          onPress={() => router.push('/setting')}
          className="rounded-2xl px-4 py-3.5">
          <Icon as={SettingsIcon} className="mr-3 h-5 w-5" />
          <MenuItemLabel className="text-sm font-medium">Settings</MenuItemLabel>
        </MenuItem>

        <MenuSeparator className="bg-outline-100 dark:bg-outline-800 my-2" />

        {/* Theme Selectors with Crisp Blue Active States */}
        <MenuItem
          key="light"
          textValue="Light"
          onPress={() => {
            setTheme('light');
            setAppTheme('light');
          }}
          className="rounded-2xl px-4 py-3.5">
          <Icon as={SunIcon} className="mr-3 h-5 w-5 text-amber-500" />
          <MenuItemLabel className="text-sm font-medium">Light</MenuItemLabel>
          <Activity mode={theme === 'light' ? 'visible' : 'hidden'}>
            <Icon as={CheckIcon} className="ml-auto h-5 w-5 text-blue-600 dark:text-blue-400" />
          </Activity>
        </MenuItem>

        <MenuItem
          key="dark"
          textValue="Dark"
          onPress={() => {
            setTheme('dark');
            setAppTheme('dark');
          }}
          className="rounded-2xl px-4 py-3.5">
          <Icon as={MoonIcon} className="mr-3 h-5 w-5 text-indigo-400" />
          <MenuItemLabel className="text-sm font-medium">Dark</MenuItemLabel>
          <Activity mode={theme === 'dark' ? 'visible' : 'hidden'}>
            <Icon as={CheckIcon} className="ml-auto h-5 w-5 text-blue-600 dark:text-blue-400" />
          </Activity>
        </MenuItem>

        <MenuItem
          key="system"
          textValue="System"
          onPress={() => {
            setTheme('system');
            setAppTheme('system');
          }}
          className="rounded-2xl px-4 py-3.5">
          <Icon as={MenuIcon} className="mr-3 h-5 w-5" />
          <MenuItemLabel className="text-sm font-medium">System</MenuItemLabel>
          <Activity mode={theme === 'system' ? 'visible' : 'hidden'}>
            <Icon as={CheckIcon} className="ml-auto h-5 w-5 text-blue-600 dark:text-blue-400" />
          </Activity>
        </MenuItem>
      </Menu>

      {/* Squarish Profile Avatar with Crisp Blue Border */}
      <ThrottledTouchable
        onPress={() => router.push('/setting')}
        className="ml-1 active:opacity-80">
        <Box className="rounded-2xl border-2 border-blue-600 bg-white p-0.5 shadow-sm dark:border-blue-400 dark:bg-zinc-950">
          <Avatar className="h-11 w-11 rounded-xl">
            <AvatarFallbackText className="font-semibold text-blue-700 dark:text-blue-100">
              {user?.firstName ?? '?'}
            </AvatarFallbackText>
            <AvatarImage
              source={user?.avatar ? { uri: user.avatar } : undefined}
              className="rounded-xl"
            />
          </Avatar>
        </Box>
      </ThrottledTouchable>
    </Box>
  );
}
