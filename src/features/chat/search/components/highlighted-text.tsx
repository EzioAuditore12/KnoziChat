import { Text } from '@/components/ui/text';

export function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim() || !text) {
    return <Text>{text}</Text>;
  }

  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text.split(regex);

  return (
    <Text>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Text key={index} className="bg-amber-400 font-semibold text-black">
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
}
