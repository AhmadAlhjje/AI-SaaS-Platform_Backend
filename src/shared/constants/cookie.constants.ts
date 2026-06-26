import type { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const ACCESS_TOKEN_COOKIE_MAX_AGE_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};
