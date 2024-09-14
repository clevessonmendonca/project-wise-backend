import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../models/prismaClient';
import { ValidationError, ServerError } from '../validationErrors';
import { UserService } from './userService';
import { PasswordService } from '../utils/passwordService';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { REFRESH_TOKEN_SECRET } from '../config';

interface DecodedToken {
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: any;
}

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async loginUser(email: string, password: string): Promise<{ token: string, refreshToken: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user || !user.password) {
        throw new ValidationError('Usuário não encontrado');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        throw new ValidationError('Senha incorreta');
      }
  
      const token = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id); 
  
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });
  
      return { token, refreshToken };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      } else {
        console.error('Erro interno do servidor:', error);
        throw new ServerError('Falha ao realizar login. Tente novamente mais tarde.');
      }
    }
  }

  public async handleGoogleCallback(idToken: string, accessToken: string) {
    try {
      const decodedToken: DecodedToken = jwt.decode(idToken) as DecodedToken;
      const email = decodedToken.email;
      const name = decodedToken.name;
      const picture = decodedToken.picture;

      if (!email || !name) {
        throw new ValidationError('Email ou nome não encontrados no token.');
      }

      let user = await this.userService.getUserByEmail(email);

      if (!user) {
        const rawPassword = PasswordService.generateRandomPassword();
        const hashedPassword = await PasswordService.hashPassword(rawPassword);

        const newUser = await this.userService.createUser({
          email,
          name,
          password: hashedPassword,
          picture,
        });

        user = newUser;
      }

      const token = generateAccessToken(user.id);
      return { token };
    } catch (err) {
      if (err instanceof ValidationError) {
        throw err;
      } else {
        throw new ServerError('Falha ao processar o callback do OAuth.');
      }
    }
  }

  public async refreshTokens(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { sub: string };
  
      const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!user || user.refreshToken !== refreshToken) {
        throw new ValidationError('Refresh token inválido');
      }
  
      const newAccessToken = generateAccessToken(user.id);
      const newRefreshToken = generateRefreshToken(user.id);
  
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });
  
      return { token: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ValidationError('Refresh token inválido ou expirado');
    }
  }
}
