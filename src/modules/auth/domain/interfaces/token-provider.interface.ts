export interface JwtPayload {
  readonly sub: string;
  readonly companyId: string | null;
}

export interface TokenProvider {
  signAccessToken(payload: JwtPayload): string;
  signRefreshToken(payload: JwtPayload): string;
  verifyRefreshToken(token: string): JwtPayload;
}
