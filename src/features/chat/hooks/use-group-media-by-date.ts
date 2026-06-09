import { useMemo } from 'react';
import { format } from '@bernagl/react-native-date';

export function useGroupMediaByDate<T extends { createdAt: number }>(data: T[] | undefined | null) {
  return useMemo(() => {
    if (!data) return [];

    const groups: { title: string; data: T[] }[] = [];

    data.forEach((item) => {
      const date = format(new Date(item.createdAt), 'MMMM dd, yyyy');

      const group = groups.find((g) => g.title === date);
      if (group) {
        group.data.push(item);
      } else {
        groups.push({ title: date, data: [item] });
      }
    });

    return groups;
  }, [data]);
}
