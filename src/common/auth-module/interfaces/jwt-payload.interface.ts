export interface JwtPayload {
	email: string;
	extensionAttribute2: string;
	sn: string;
	mailNickname: string;
	detAttribute2: string;
	givenName: string;
	groups: string[];
	iat: number;
	exp: number;
	sub: string;
}
