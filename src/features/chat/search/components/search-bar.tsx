import { SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <Input className="mb-3 rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <InputSlot>
        <InputIcon as={SearchIcon} />
      </InputSlot>

      <InputField
        placeholder="Search chats..."
        value={value}
        onChangeText={onChangeText}
        className="text-zinc-900 placeholder:text-zinc-500 dark:text-zinc-50 dark:placeholder:text-zinc-400"
      />
    </Input>
  );
}
