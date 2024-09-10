import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../models/prismaClient';
import { ValidationError, ServerError } from '../validationErrors';
import { UserService } from './userService';
import { PasswordService } from '../utils/passwordService';
import { generateToken } from '../utils/jwt';

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

  public async loginUser(email: string, password: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new ValidationError('Usuário não encontrado');
      }

      if (!user.password) {
        throw new ValidationError(
          'Senha não cadastrada. Entre em contato com o suporte.',
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new ValidationError('Senha incorreta');
      }

      const token = generateToken(user.id);
      return token;
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

      const token = generateToken(user.id);
      return { token };
    } catch (err) {
      if (err instanceof ValidationError) {
        throw err;
      } else {
        throw new ServerError('Falha ao processar o callback do OAuth.');
      }
    }
  }
}
