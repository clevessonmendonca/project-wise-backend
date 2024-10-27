import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/authService';
import { ProfileController } from './profileController';

interface RefreshTokenRequest {
  refreshToken: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Custom error type
interface CustomError extends Error {
  statusCode?: number;
}

export class AuthController {
  private authService: AuthService;
  private profileController: ProfileController;

  constructor() {
    this.authService = new AuthService();
    this.profileController = new ProfileController();
  }

  public async loginUser(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const { token, refreshToken } = await this.authService.loginUser(email, password);
      reply.send({ token, refreshToken });
    } catch (error) {
      this.handleError(error, reply, 'Failed to log in user');
    }
  }

  public async forgotPassword(
    req: FastifyRequest<{ Body: ForgotPasswordRequest }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      reply.send({ message: 'Email de recuperação enviado' });
    } catch (error) {
      this.handleError(error, reply, 'Falha ao enviar o email de recuperação');
    }
  }

  public async resetPassword(
    req: FastifyRequest<{ Body: ResetPasswordRequest }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      reply.send({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      this.handleError(error, reply, 'Falha ao redefinir a senha');
    }
  }

  public async googleCallback(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // @ts-ignore: Ignore TypeScript error for server.googleOAuth2
      const getToken = await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
      const accessToken = getToken.token.access_token;
      const idToken = getToken.token.id_token;

      if (!accessToken || !idToken) {
        throw new Error('Access token or ID token is undefined');
      }

      const { token } = await this.authService.handleGoogleCallback(idToken, accessToken);
      reply.redirect(`http://localhost:3000/dashboard?token=${token}`);
    } catch (error) {
      this.handleError(error, reply, 'Failed to handle OAuth callback');
    }
  }

  public async refreshToken(
    req: FastifyRequest<{ Body: RefreshTokenRequest }>, 
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const newTokens = await this.authService.refreshTokens(refreshToken);
      reply.send(newTokens);
    } catch (error) {
      this.handleError(error, reply, 'Token inválido ou expirado');
    }
  }

  private handleError(error: unknown, reply: FastifyReply, defaultMessage: string) {
    if (this.isCustomError(error)) {
      console.error('Error:', error.message);
      reply.status(error.statusCode || 500).send({ error: error.message });
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
      reply.status(500).send({ error: defaultMessage, details: error.message });
    } else {
      console.error('Unexpected error:', error);
      reply.status(500).send({ error: 'Unexpected error occurred' });
    }
  }

  private isCustomError(error: unknown): error is CustomError {
    return (error as CustomError).message !== undefined;
  }
}
