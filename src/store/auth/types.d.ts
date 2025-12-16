type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type User = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phoneNumber: string;
  email: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface AuthStore {
  user: User | null;
  tokens: Tokens | null;
  setUserDetails(data: User): void;
  setUserTokens(data: Tokens): void;
  logout: () => void;
}
