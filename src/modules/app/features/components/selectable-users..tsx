import { H3 } from "@/components/ui/typography";
import type { User } from "@/modules/app/features/api/search-user";
import { UserCard } from "@/modules/app/features/components/user-card";
import { ScrollView, View } from "react-native";

interface SelectedUsersProps {
	users: User[];
	onRemove: (userId: string) => void;
}

export function SelectedUsers({ users, onRemove }: SelectedUsersProps) {
	if (users.length === 0) return null;

	return (
		<>
			<H3>Selected Users</H3>
			<ScrollView horizontal>
				{users.map((user) => (
					<UserCard
						key={user.id}
						firstName={user.firstName}
						phoneNumber={user.phoneNumber}
						profilePicture={user.profilePicture}
						showClose
						onClose={() => onRemove(user.id)}
					/>
				))}
			</ScrollView>
		</>
	);
}
