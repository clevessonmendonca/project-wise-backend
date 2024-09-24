import { FastifyRequest, FastifyReply } from 'fastify';
import { TaskService } from '../services/taskService';
import { Task } from '@prisma/client';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  public async getAllTasks(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();
      reply.send(tasks);
    } catch (error) {
      this.handleError(reply, error, 'Failed to fetch tasks');
    }
  }

  public async getTaskById(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const task = await this.taskService.getTaskById(id);
      if (task) {
        reply.send(task);
      } else {
        reply.status(404).send({ error: 'Task not found' });
      }
    } catch (error) {
      this.handleError(reply, error, 'Failed to fetch task');
    }
  }

  public async createTask(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const taskData = req.body as Task;
      const task = await this.taskService.createTask(taskData);
      reply.status(201).send(task);
    } catch (error) {
      this.handleError(reply, error, 'Failed to create task');
    }
  }

  public async updateTask(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const taskData = req.body as Task;
      const updatedTask = await this.taskService.updateTask(id, taskData);
      if (updatedTask) {
        reply.send(updatedTask);
      } else {
        reply.status(404).send({ error: 'Task not found' });
      }
    } catch (error) {
      this.handleError(reply, error, 'Failed to update task');
    }
  }

  public async deleteTask(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const deletedTask = await this.taskService.deleteTask(id);
      if (deletedTask) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: 'Task not found' });
      }
    } catch (error) {
      this.handleError(reply, error, 'Failed to delete task');
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
        .send({ error: message, details: 'An unknown error occurred' });
    }
  }
}
