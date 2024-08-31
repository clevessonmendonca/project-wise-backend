import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService';
import { CreateUserBody, UpdateUserBody } from '../types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getAllUsers(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      reply.send(users);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch users' });
    }
  }

  public async getUserById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const user = await this.userService.getUserById(id);
      if (user) {
        reply.send(user);
      } else {
        reply.status(404).send({ error: 'User not found' });
      }
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch user' });
    }
  }

  public async createUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = req.body as CreateUserBody;
    try {
      const user = await this.userService.createUser(body);
      reply.status(201).send(user);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create user' });
    }
  }

  public async updateUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };
    const body = req.body as UpdateUserBody;
    try {
      const updatedUser = await this.userService.updateUser(id, body);
      if (updatedUser) {
        reply.send(updatedUser);
      } else {
        reply.status(404).send({ error: 'User not found' });
      }
    } catch (error) {
      reply.status(500).send({ error: 'Failed to update user' });
    }
  }

  public async deleteUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const deletedUser = await this.userService.deleteUser(id);
      if (deletedUser) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: 'User not found' });
      }
    } catch (error) {
      reply.status(500).send({ error: 'Failed to delete user' });
    }
  }
}
