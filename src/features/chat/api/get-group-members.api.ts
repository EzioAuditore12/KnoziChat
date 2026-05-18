import { env } from '@/env';
import { typedFetch } from '@/lib/fetch';
import { groupMemberSchema } from '../schemas/group-member.schema';

export const getGroupMembersApi = async (id: string) => {
  return typedFetch({
    url: `${env.API_URL}/chat/group/members/${id}`,
    method: 'GET',
    schema: groupMemberSchema.array(),
  });
};
