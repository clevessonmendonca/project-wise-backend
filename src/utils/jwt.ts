import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';

export function generateToken(userId: string): string {
  return jwt.sign({ sub: userId }, SECRET_KEY, { expiresIn: '2h' });
}
export function verifyToken(token: string) {
  return jwt.verify(token, SECRET_KEY);
}
