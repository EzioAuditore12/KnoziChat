type User =
	| {
			id:string
			firstName: string;
			lastName: string;
			email: string;
			profilePicture: string | null;
	  }
	| undefined;

type tokens =
	| {
			accessToken: string | undefined;
			refreshToken: string | undefined;
	  }
	| undefined;

export interface authStoreType {
	user: User;
	tokens: tokens;
	setUser(user: User): void;
	setTokens(tokens: tokens): void;
	logout(): void;
}
