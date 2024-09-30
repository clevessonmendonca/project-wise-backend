import prisma from '../../models/prismaClient';

export class BoardService {
  public async getAllBoards() {
    return await prisma.board.findMany({
      include: { project: true, tasks: true },
    });
  }

  public async getBoardById(id: string) {
    return await prisma.board.findUnique({
      where: { id },
      include: { project: true, tasks: true },
    });
  }

  public async createBoard(data: any) {
    return await prisma.board.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        projectId: data.projectId,
        createdAt: new Date(),
        tasks: { create: [] },
      },
    });
  }

  public async updateBoard(id: string, data: any) {
    return await prisma.board.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
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

  public async countUserFavorites(userId: string) {
    return await prisma.favoriteBoard.count({
      where: { userId },
    });
  }

  public async isBoardFavorited(userId: string, boardId: string) {
    return await prisma.favoriteBoard.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId,
        },
      },
    });
  }

  public async addFavorite(userId: string, boardId: string) {
    return await prisma.favoriteBoard.create({
      data: { userId, boardId },
    });
  }

  public async removeFavorite(userId: string, boardId: string) {
    return await prisma.favoriteBoard.delete({
      where: {
        userId_boardId: {
          userId,
          boardId,
        },
      },
    });
  }
}
