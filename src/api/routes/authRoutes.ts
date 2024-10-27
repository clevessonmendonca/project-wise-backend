import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/authController';

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();

  fastify.post('/login', authController.loginUser.bind(authController));
  fastify.get(
    '/login/google/callback',
    authController.googleCallback.bind(authController),
  );
  fastify.post('/refresh-token', authController.refreshToken.bind(authController));
  
  fastify.post('/forgot-password', authController.forgotPassword.bind(authController));
  fastify.post('/reset-password', authController.resetPassword.bind(authController));
}
