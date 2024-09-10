import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/authController';

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();

  fastify.post('/login', authController.loginUser.bind(authController));
  fastify.get(
    '/login/google/callback',
    authController.googleCallback.bind(authController),
  );
}
