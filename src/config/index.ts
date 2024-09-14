import * as dotenv from 'dotenv';

dotenv.config();

export const SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultSecretKey';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'defaultRefreshSecret';
