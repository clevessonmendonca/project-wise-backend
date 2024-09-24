import { FastifyInstance } from 'fastify';
import { TaskController } from '../controllers/taskController';

export default async function taskRoutes(fastify: FastifyInstance) {
  const taskController = new TaskController();

  fastify.get('/', taskController.getAllTasks.bind(taskController));
  fastify.get('/:id', taskController.getTaskById.bind(taskController));
  fastify.post('/', taskController.createTask.bind(taskController));
  fastify.put('/:id', taskController.updateTask.bind(taskController));
  fastify.delete('/:id', taskController.deleteTask.bind(taskController));
}
