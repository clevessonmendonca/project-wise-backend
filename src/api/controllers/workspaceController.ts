import { FastifyRequest, FastifyReply } from 'fastify';
import { WorkspaceService } from '../services/workspaceService';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from '../../errors/validationSchemas';
import { ZodError } from 'zod';
import { NotFoundError, ValidationError } from '../../errors/validationErrors';

export class WorkspaceController {
  private workspaceService: WorkspaceService;

  constructor() {
    this.workspaceService = new WorkspaceService();
  }

  public async getAllWorkspaces(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const workspaces = await this.workspaceService.getAllWorkspaces();
      reply.send(workspaces);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      reply.status(500).send({ error: 'Failed to fetch workspaces' });
    }
  }

  public async getWorkspaceById(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const workspace = await this.workspaceService.getWorkspaceById(id);
      if (workspace) {
        reply.send(workspace);
      } else {
        reply.status(404).send({ error: 'Workspace not found' });
      }
    } catch (error) {
      console.error('Error fetching workspace:', error);
      reply.status(500).send({ error: 'Failed to fetch workspace' });
    }
  }

  public async createWorkspace(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const body = createWorkspaceSchema.parse(req.body);
      const workspace = await this.workspaceService.createWorkspace(body);
      reply.status(201).send(workspace);
    } catch (error) {
      if (error instanceof ValidationError) {
        reply.status(error.statusCode).send({ error: error.message });
      } else if (error instanceof NotFoundError) {
        reply.status(error.statusCode).send({ error: error.message });
      } else if (error instanceof Error) {
        console.error('Unexpected error:', error.message);
        reply.status(500).send({ error: 'Internal server error' });
      } else {
        console.error('Unknown error:', error);
        reply.status(500).send({ error: 'Unknown error occurred' });
      }
    }
  }

  public async updateWorkspace(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const body = updateWorkspaceSchema.parse(req.body);
      const updatedWorkspace = await this.workspaceService.updateWorkspace(
        id,
        body,
      );
      if (updatedWorkspace) {
        reply.send(updatedWorkspace);
      } else {
        reply.status(404).send({ error: 'Workspace not found' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        reply.status(400).send({ error: error.errors });
      } else {
        console.error('Error updating workspace:', error);
        reply.status(500).send({ error: 'Failed to update workspace' });
      }
    }
  }

  public async deleteWorkspace(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const deletedWorkspace = await this.workspaceService.deleteWorkspace(id);
      if (deletedWorkspace) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: 'Workspace not found' });
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
      reply.status(500).send({ error: 'Failed to delete workspace' });
    }
  }
}
