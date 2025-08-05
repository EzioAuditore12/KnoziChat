import { LegendList, LegendListProps } from "@legendapp/list";
import type { ReactNode } from "react";

export interface VirtualizedListProps<T>
	extends Omit<LegendListProps<T>, "data" | "renderItem" | "keyExtractor"> {
	items?: T[]; // Optional if using pages
	pages?: { users: T[] }[]; // Accepts paginated data
	renderItem: (item: T, index: number) => ReactNode;
	keyExtractor?: (item: T, index: number) => string;
}

export function VirtualizedList<T>({
	items,
	pages,
	renderItem,
	keyExtractor = (_item, index) => String(index),
	...props
}: VirtualizedListProps<T>) {
	const flatItems = pages ? pages.flatMap((page) => page.users) : (items ?? []);

	return (
		<LegendList
			data={flatItems}
			renderItem={({ item, index }) => renderItem(item, index)}
			keyExtractor={keyExtractor}
			recycleItems
			{...props}
		/>
	);
}
