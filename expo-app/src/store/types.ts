import type { User } from '@/features/app/user/schemas/user.schema';
import type { Tokens } from '@/features/auth/common/schemas/token.schema';

export interface AuthStore {
  user: User | null;
  tokens: Tokens | null;
  setUserDetails(data: User): void;
  setUserTokens(data: Tokens): void;
  logout: () => void;
}
