import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { View } from "react-native";

export function LoadingGroupInfoSkeleton({
	className,
}: { className?: string }) {
	return (
		<View className={cn("justify-center items-center gap-y-3", className)}>
			<Skeleton className="size-40 rounded-full mb-2" />
			<Skeleton className="h-8 w-32 rounded-md mb-1" />
			<Skeleton className="h-5 w-40 rounded mb-1" />
			<Skeleton className="h-5 w-28 rounded" />
		</View>
	);
}
