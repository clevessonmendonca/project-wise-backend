import { FastifyInstance } from 'fastify';
import { ProjectController } from '../controllers/projectController';
import { authenticate } from '../../middlewares/authenticate';

export default async function projectRoutes(fastify: FastifyInstance) {
  const projectController = new ProjectController();

  fastify.addHook('preHandler', authenticate);

  fastify.get('', projectController.getAllProjects.bind(projectController));
  fastify.get('/:id', projectController.getProjectById.bind(projectController));
  fastify.post('', projectController.createProject.bind(projectController));
  fastify.put('/:id', projectController.updateProject.bind(projectController));
  fastify.delete('/:id', projectController.deleteProject.bind(projectController));
  
  fastify.get('/:id/boards', projectController.getProjectBoards.bind(projectController));
  fastify.get('/:id/tasks', projectController.getProjectTasks.bind(projectController));
  fastify.get('/:id/feedback', projectController.getProjectFeedback.bind(projectController));
  fastify.get('/:id/risks', projectController.getProjectRisks.bind(projectController));
  fastify.get('/:id/resource-allocations', projectController.getProjectResourceAllocations.bind(projectController));
  fastify.get('/:id/teams', projectController.getProjectTeams.bind(projectController));
  fastify.get('/:id/comments', projectController.getProjectComments.bind(projectController));
  fastify.get('/:id/change-logs', projectController.getProjectChangeLogs.bind(projectController));
}
