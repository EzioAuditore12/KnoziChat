import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

import { HighlightedText } from './highlighted-text';
import type { ChatSearchResult } from '../types';

interface SearchResultCardProps {
  item: ChatSearchResult;
  highlight: string;
}

export function SearchResultCard({ item, highlight }: SearchResultCardProps) {
  return (
    <Card className="mb-3 rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Text className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        <HighlightedText text={item.name || ''} highlight={highlight} />
      </Text>

      <Text className="text-sm text-zinc-600 dark:text-zinc-300">
        <HighlightedText text={item.lastMessage || ''} highlight={highlight} />
      </Text>

      <Text className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        {new Date(item.updatedAt).toLocaleString()}
      </Text>
    </Card>
  );
}
