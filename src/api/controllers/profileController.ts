import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config';

export class ProfileController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getProfile(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send({ error: 'Unauthorized' });
        return;
      }

      const token = authHeader.split(' ')[1];

      const userId = this.validateTokenAndGetUserId(token);

      if (!userId) {
        reply.status(401).send({ error: 'Unauthorized' });
        return;
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        reply.status(404).send({ error: 'User not found' });
        return;
      }

      reply.send(user);
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      reply.status(500).send({ error: 'Failed to retrieve user profile' });
    }
  }

  private validateTokenAndGetUserId(token: string): string | null {
    try {
      const decoded = jwt.verify(token, SECRET_KEY as string) as {
        sub: string;
      };
      return decoded.sub;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }
}
