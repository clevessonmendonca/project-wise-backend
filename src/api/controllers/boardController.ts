import { FastifyRequest, FastifyReply } from 'fastify';
import { BoardService } from '../services/boardService';
import { Board } from '@prisma/client';

export class BoardController {
  private boardService: BoardService;

  constructor() {
    this.boardService = new BoardService();
  }

  public async getAllBoards(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const boards = await this.boardService.getAllBoards();
      reply.send(boards);
    } catch (error) {
      this.handleError(reply, error, 'Falha ao buscar boards');
    }
  }

  public async getBoardById(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const board = await this.boardService.getBoardById(id);
      if (board) {
        reply.send(board);
      } else {
        reply.status(404).send({ error: 'Board não encontrado' });
      }
    } catch (error) {
      this.handleError(reply, error, 'Falha ao buscar o board');
    }
  }

  public async createBoard(
    req: FastifyRequest<{ Body: Board }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const boardData = req.body;

      if (!boardData.projectId) {
        return reply.status(400).send({ error: 'projectId é obrigatório' });
      }

      const board = await this.boardService.createBoard(boardData);
      reply.status(201).send(board);
    } catch (error) {
      this.handleError(reply, error, 'Falha ao criar o board');
    }
  }

  public async updateBoard(
    req: FastifyRequest<{ Params: { id: string }; Body: Board }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params;
    try {
      const boardData = req.body;
      const updatedBoard = await this.boardService.updateBoard(id, boardData);
      if (updatedBoard) {
        reply.send(updatedBoard);
      } else {
        reply.status(404).send({ error: 'Board não encontrado' });
      }
    } catch (error) {
      this.handleError(reply, error, 'Falha ao atualizar o board');
    }
  }

  public async deleteBoard(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const deletedBoard = await this.boardService.deleteBoard(id);
      if (deletedBoard) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: 'Board não encontrado' });
      }
    } catch (error) {
      this.handleError(reply, error, 'Falha ao deletar o board');
    }
  }

  public async getBoardTasks(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const tasks = await this.boardService.getBoardTasks(id);
      reply.send(tasks);
    } catch (error) {
      this.handleError(reply, error, 'Falha ao buscar tarefas do board');
    }
  }

  public async toggleFavoriteBoard(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return reply.status(401).send({ error: 'Usuário não autenticado' });
    }

    try {
      const favoritesCount = await this.boardService.countUserFavorites(userId);
      const isFavorited = await this.boardService.isBoardFavorited(userId, id);

      if (!isFavorited && favoritesCount >= 3) {
        return reply
          .status(400)
          .send({ error: 'Você pode favoritar no máximo 3 boards' });
      }

      if (isFavorited) {
        await this.boardService.removeFavorite(userId, id);
        reply.send({ message: 'Board desfavoritado com sucesso' });
      } else {
        await this.boardService.addFavorite(userId, id);
        reply.send({ message: 'Board favoritado com sucesso' });
      }
    } catch (error) {
      this.handleError(reply, error, 'Falha ao favoritar/desfavoritar o board');
    }
  }

  private handleError(reply: FastifyReply, error: unknown, message: string) {
    if (error instanceof Error) {
      console.error(message, error.message);
      reply.status(500).send({ error: message, details: error.message });
    } else {
      console.error(message, error);
      reply
        .status(500)
        .send({ error: message, details: 'Ocorreu um erro desconhecido' });
    }
  }
}
