import { FastifyInstance } from 'fastify';
import { ProfileController } from '../controllers/profileController';

export default async function profileRoutes(fastify: FastifyInstance) {
  const profileController = new ProfileController();

  fastify.get('/', profileController.getProfile.bind(profileController));
}
