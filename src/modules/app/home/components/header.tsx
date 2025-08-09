import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { type LinkProps, router } from "expo-router";
import { Plus, Search } from "lucide-react-native";
import { ComponentProps } from "react";
import { Pressable, View } from "react-native";

interface StartChatProps extends ComponentProps<typeof DropdownMenu> {}

function StartChat({ className, ...props }: StartChatProps) {
	return (
		<DropdownMenu className={cn(className)} {...props}>
			<DropdownMenuTrigger asChild>
				<Pressable className="mr-2 rounded-full bg-gray-400 p-2">
					<Plus size={30} color={"white"} />
				</Pressable>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-64 native:w-72">
				<DropdownMenuLabel>Operations</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						onPress={() => router.push("/(features)/create-group")}
					>
						<Text>New Group</Text>
						<DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onPress={() => router.push("/(features)/search")}>
					<Text>New Chat</Text>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Text className="text-red-500">Close</Text>
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function Header() {
	return (
		<View className="flex-row px-4 justify-between items-center py-2">
			<Text className="font-semibold text-4xl">Knozichat</Text>

			<StartChat className="ml-auto" />

			<Pressable
				className="rounded-full bg-gray-400 p-2"
				onPress={() => router.navigate("/(features)/search")}
			>
				<Search size={30} color={"white"} />
			</Pressable>
		</View>
	);
}
