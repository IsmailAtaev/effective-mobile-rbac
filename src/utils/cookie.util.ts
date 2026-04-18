import { CookieOptions } from 'express';

export const cookieParams: CookieOptions = {
  httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'strict',
  signed: true,
  path: '/',
};