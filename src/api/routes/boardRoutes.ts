import { FastifyInstance } from 'fastify';
import { BoardController } from '../controllers/boardController';
import { authenticate } from '../../middlewares/authenticate';

export default async function boardRoutes(fastify: FastifyInstance) {
  const boardController = new BoardController();
  
  fastify.addHook('preHandler', authenticate);
  
  fastify.get('/', boardController.getAllBoards.bind(boardController));
  fastify.get('/:id', boardController.getBoardById.bind(boardController));
  fastify.post('/', boardController.createBoard.bind(boardController));
  fastify.put('/:id', boardController.updateBoard.bind(boardController));
  fastify.delete('/:id', boardController.deleteBoard.bind(boardController));
  fastify.put('/:id/favorite', boardController.toggleFavoriteBoard.bind(boardController));

  fastify.get('/:id/tasks', boardController.getBoardTasks.bind(boardController));
}
