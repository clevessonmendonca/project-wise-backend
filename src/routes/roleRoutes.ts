import { FastifyInstance } from 'fastify';
import { RoleController } from '../controllers/roleController';
import { checkPermissions } from '../middlewares/checkPermissions';

export default async function roleRoutes(fastify: FastifyInstance) {
  const roleController = new RoleController();

  fastify.post('/', { preHandler: checkPermissions(['admin']) }, roleController.createRole.bind(roleController));
  fastify.get('/', { preHandler: checkPermissions(['admin']) }, roleController.getRoles.bind(roleController));
  fastify.put('/:id', { preHandler: checkPermissions(['admin']) }, roleController.updateRole.bind(roleController));
  fastify.delete('/:id', { preHandler: checkPermissions(['admin']) }, roleController.deleteRole.bind(roleController));
  fastify.post('/assign', { preHandler: checkPermissions(['admin']) }, roleController.assignRole.bind(roleController));
}
