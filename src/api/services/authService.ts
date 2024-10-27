import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../../models/prismaClient';
import { ValidationError, ServerError } from '../../errors/validationErrors';
import { UserService } from './userService';
import { PasswordService } from '../../utils/passwordService';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { BASE_URL_FRONT, REFRESH_TOKEN_SECRET } from '../../config/env';
import { sendResetPasswordEmail } from '../../utils/sendResetPasswordEmail';

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

  public async loginUser(
    email: string,
    password: string,
  ): Promise<{ token: string; refreshToken: string }> {
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
        throw new ServerError(
          'Falha ao realizar login. Tente novamente mais tarde.',
        );
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

  public async refreshTokens(
    refreshToken: string,
  ): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
        sub: string;
      };

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

  public async forgotPassword(email: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new ValidationError('Usuário não encontrado com esse e-mail.');
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // Token expira em 1 hora

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpires,
        },
      });

      const resetUrl = `${BASE_URL_FRONT}/auth/reset-password?token=${resetToken}`;
      await sendResetPasswordEmail(user.email, resetUrl);
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação de senha:', error);
      throw new ServerError('Falha ao enviar e-mail de recuperação de senha.');
    }
  }

  public async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<void> {
    try {
      console.log(token, newPassword);
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpires: { gt: new Date() },
        },
      });

      if (!user) {
        throw new ValidationError('Token inválido ou expirado.');
      }

      const hashedPassword = await PasswordService.hashPassword(newPassword);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null, // Limpa o token após a utilização
          resetTokenExpires: null, // Limpa a expiração após a utilização
        },
      });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      throw new ServerError('Falha ao redefinir senha.');
    }
  }
}
