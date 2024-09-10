import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 10; 

export class PasswordService {
  public static generateRandomPassword(length: number = 12): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  public static async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  public static async generateAndHashPassword(length: number = 12): Promise<string> {
    const password = this.generateRandomPassword(length);
    return this.hashPassword(password);
  }
}
