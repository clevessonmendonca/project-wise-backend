import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/userController';

export default async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController();

  fastify.get('/', userController.getAllUsers.bind(userController));
  fastify.get('/:id', userController.getUserById.bind(userController));
  fastify.post('/', userController.createUser.bind(userController));
  fastify.put('/:id', userController.updateUser.bind(userController));
  fastify.delete('/:id', userController.deleteUser.bind(userController));
}
