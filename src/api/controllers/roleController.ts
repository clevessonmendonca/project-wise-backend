import { FastifyRequest, FastifyReply } from 'fastify';
import { RoleService } from '../services/roleService';
import {
  createRoleSchema,
  updateRoleSchema,
  CreateRoleBody,
  UpdateRoleBody,
} from '../../validationSchemas';
import { ZodError } from 'zod';
import { ValidationError } from '../../validationErrors';

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  public async createRole(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const body = createRoleSchema.parse(req.body);
      const role = await this.roleService.createRole(body);
      reply.status(201).send(role);
    } catch (error) {
      if (error instanceof ZodError) {
        reply
          .status(400)
          .send({ error: 'Validation failed', details: error.errors });
      } else {
        console.error('Error creating role:', error);
        reply.status(500).send({ error: 'Failed to create role' });
      }
    }
  }

  public async getRoles(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const roles = await this.roleService.getRoles();
      reply.send(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      reply.status(500).send({ error: 'Failed to fetch roles' });
    }
  }

  public async updateRole(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const body = updateRoleSchema.parse(req.body);
      const updatedRole = await this.roleService.updateRole(id, body);
      if (updatedRole) {
        reply.send(updatedRole);
      } else {
        reply.status(404).send({ error: 'Role not found' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        reply
          .status(400)
          .send({ error: 'Validation failed', details: error.errors });
      } else {
        console.error('Error updating role:', error);
        reply.status(500).send({ error: 'Failed to update role' });
      }
    }
  }

  public async deleteRole(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const deletedRole = await this.roleService.deleteRole(id);
      if (deletedRole) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: 'Role not found' });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      reply.status(500).send({ error: 'Failed to delete role' });
    }
  }

  public async assignRole(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { userId, roleId } = request.body as {
        userId: string;
        roleId: string;
      };

      await this.roleService.assignRole(userId, roleId);

      reply.send({ message: 'Role assigned successfully' });
    } catch (error) {
      if (error instanceof ValidationError) {
        reply.status(400).send({ error: error.message });
      } else {
        console.error('Error assigning role:', error);
        reply.status(500).send({ error: 'Failed to assign role' });
      }
    }
  }
}
