import type { ConversationGroup } from '@/db/tables/conversation-group.table';

export type GroupOption = Pick<ConversationGroup, 'id' | 'name' | 'avatar'>;
