import * as dotenv from 'dotenv';

dotenv.config();

export const SECRET_KEY = process.env.JWT_SECRET_KEY || '5i7Qp7ChDh61l4m9hFLz2wG8kR0sfGtJg2e6yK3Yp1Y=';
