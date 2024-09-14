import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/authService';
import { ProfileController } from './profileController';

interface RefreshTokenRequest {
  refreshToken: string;
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
      const token = await this.authService.loginUser(email, password);
      reply.send({ token });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error logging in user:', error.message);
        reply
          .status(500)
          .send({ error: 'Failed to log in user', details: error.message });
      } else {
        console.error('Unexpected error:', error);
        reply.status(500).send({ error: 'Unexpected error occurred' });
      }
    }
  }

  public async googleCallback(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // @ts-ignore
      const getToken = await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
      const accessToken = getToken.token.access_token;
      const idToken = getToken.token.id_token;

      if (!accessToken || !idToken) {
        throw new Error('Access token or ID token is undefined');
      }

      const { token } = await this.authService.handleGoogleCallback(idToken, accessToken);

      reply.redirect(`http://localhost:3000/dashboard?token=${token}`);
    } catch (err) {
      console.error('Error handling OAuth callback:', err);
      reply.status(500).send({ error: 'Failed to handle OAuth callback' });
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
      reply.status(401).send({ error: 'Token inválido ou expirado' });
    }
  }
}
