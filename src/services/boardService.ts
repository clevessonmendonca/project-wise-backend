import prisma from '../models/prismaClient';

export class BoardService {
  public async getAllBoards() {
    return await prisma.board.findMany();
  }

  public async getBoardById(id: string) {
    return await prisma.board.findUnique({
      where: { id },
      include: { tasks: true }
    });
  }

  public async createBoard(data: any) {
    return await prisma.board.create({
      data,
    });
  }

  public async updateBoard(id: string, data: any) {
    return await prisma.board.update({
      where: { id },
      data,
    });
  }

  public async deleteBoard(id: string) {
    return await prisma.board.delete({
      where: { id },
    });
  }

  public async getBoardTasks(boardId: string) {
    return await prisma.task.findMany({
      where: { boardId },
    });
  }
}
