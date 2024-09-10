import { FastifyInstance } from 'fastify';
import { WorkspaceController } from '../controllers/workspaceController';

export default async function workspaceRoutes(fastify: FastifyInstance) {
  const workspaceController = new WorkspaceController();

  fastify.get('/', workspaceController.getAllWorkspaces.bind(workspaceController));
  fastify.get('/:id', workspaceController.getWorkspaceById.bind(workspaceController));
  fastify.post('/', workspaceController.createWorkspace.bind(workspaceController));
  fastify.put('/:id', workspaceController.updateWorkspace.bind(workspaceController));
  fastify.delete('/:id', workspaceController.deleteWorkspace.bind(workspaceController));
}
