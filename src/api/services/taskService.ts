import { Task } from '@prisma/client';
import prisma from '../../models/prismaClient';

export class TaskService {
  public async getAllTasks() {
    return await prisma.task.findMany();
  }

  public async getTaskById(id: string) {
    return await prisma.task.findUnique({
      where: { id },
    });
  }

  public async createTask(data: Task) {
    return await prisma.task.create({
      data,
    });
  }

  public async updateTask(id: string, data: Task) {
    return await prisma.task.update({
      where: { id },
      data,
    });
  }

  public async deleteTask(id: string) {
    return await prisma.task.delete({
      where: { id },
    });
  }
}
