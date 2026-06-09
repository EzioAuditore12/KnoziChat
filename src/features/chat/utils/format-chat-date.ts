import { diffInDays, format, isToday, isYesterday } from '@bernagl/react-native-date';

export function formatChatDate(timestamp: number): string {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  const daysDifference = Math.abs(diffInDays(date, new Date()));

  if (daysDifference < 7) {
    return format(date, 'EEEE');
  }

  return format(date, 'MMM dd, yyyy');
}
