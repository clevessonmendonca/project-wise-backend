import jwt from 'jsonwebtoken';
import { SECRET_KEY, REFRESH_TOKEN_SECRET } from '../config';

export function generateAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, SECRET_KEY, { expiresIn: '1h' });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, SECRET_KEY);
}
