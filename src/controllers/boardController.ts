import { FastifyRequest, FastifyReply } from 'fastify';
import { BoardService } from '../services/boardService';

export class BoardController {
  private boardService: BoardService;

  constructor() {
    this.boardService = new BoardService();
  }

  public async getAllBoards(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const boards = await this.boardService.getAllBoards();
      reply.send(boards);
    } catch (error) {
      this.handleError(reply, error, 'Failed to fetch boards');
    }
  }

  public async getBoardById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const board = await this.boardService.getBoardById(id);
      if (board) {
        reply.send(board);
      } else {
        reply.status(404).send({ error: 'Board not found' });
      }
    } catch (error) {
      this.handleError(reply, error, 'Failed to fetch board');
    }
  }

  public async createBoard(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const boardData = req.body; 
      const board = await this.boardService.createBoard(boardData);
      reply.status(201).send(board);
    } catch (error) {
      this.handleError(reply, error, 'Failed to create board');
    }
  }

  public async updateBoard(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const boardData = req.body; // Validate body as needed
      const updatedBoard = await this.boardService.updateBoard(id, boardData);
      if (updatedBoard) {
        reply.send(updatedBoard);
      } else {
        reply.status(404).send({ error: 'Board not found' });
      }
    } catch (error) {
      this.handleError(reply, error, 'Failed to update board');
    }
  }

  public async deleteBoard(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const deletedBoard = await this.boardService.deleteBoard(id);
      if (deletedBoard) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: 'Board not found' });
      }
    } catch (error) {
      this.handleError(reply, error, 'Failed to delete board');
    }
  }

  public async getBoardTasks(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const tasks = await this.boardService.getBoardTasks(id);
      reply.send(tasks);
    } catch (error) {
      this.handleError(reply, error, 'Failed to fetch tasks');
    }
  }

  private handleError(reply: FastifyReply, error: unknown, message: string) {
    if (error instanceof Error) {
      console.error(message, error.message); // Log the error message
      reply.status(500).send({ error: message, details: error.message });
    } else {
      console.error(message, error); // Log the error details if it's not an instance of Error
      reply.status(500).send({ error: message, details: 'An unknown error occurred' });
    }
  }
}
