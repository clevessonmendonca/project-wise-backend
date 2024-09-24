import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService';
import {
  createUserSchema,
  updateUserSchema,
} from '../../errors/validationSchemas';
import { ZodError } from 'zod';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getAllUsers(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      reply.send(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      reply.status(500).send({ error: 'Failed to fetch users' });
    }
  }

  public async getUserById(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const user = await this.userService.getUserById(id);
      if (user) {
        reply.send(user);
      } else {
        reply.status(404).send({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      reply.status(500).send({ error: 'Failed to fetch user' });
    }
  }

  public async createUser(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const body = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(body);
      reply.status(201).send(user);
    } catch (error) {
      if (error instanceof ZodError) {
        reply
          .status(400)
          .send({ error: 'Validation failed', details: error.errors });
      } else if (error instanceof Error) {
        console.error('Error creating user:', error.message);
        reply
          .status(500)
          .send({ error: 'Failed to create user', details: error.message });
      } else {
        console.error('Unexpected error:', error);
        reply.status(500).send({ error: 'Unexpected error occurred' });
      }
    }
  }
  public async updateUser(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const body = updateUserSchema.parse(req.body);
      const updatedUser = await this.userService.updateUser(id, body);
      if (updatedUser) {
        reply.send(updatedUser);
      } else {
        reply.status(404).send({ error: 'User not found' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        reply.status(400).send({ error: error.errors });
      } else {
        console.error('Error updating user:', error);
        reply.status(500).send({ error: 'Failed to update user' });
      }
    }
  }

  public async deleteUser(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const deletedUser = await this.userService.deleteUser(id);
      if (deletedUser) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      reply.status(500).send({ error: 'Failed to delete user' });
    }
  }
}
