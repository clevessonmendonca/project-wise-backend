import { FastifyRequest, FastifyReply } from 'fastify';
import { ProjectService } from '../services/projectService';
import { ZodError } from 'zod';
import { Project } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../validationErrors';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  private handleError(reply: FastifyReply, error: unknown): void {
    if (error instanceof ValidationError) {
      reply.status(error.statusCode).send({ error: error.message });
    } else if (error instanceof NotFoundError) {
      reply.status(error.statusCode).send({ error: error.message });
    } else if (error instanceof ZodError) {
      reply
        .status(400)
        .send({ error: 'Invalid project data', details: error.errors });
    } else {
      console.error('Error:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  public async getAllProjects(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { workspaceId } = req.query as { workspaceId: string };
    try {
      const projects = await this.projectService.getAllProjects(workspaceId);
      reply.send(projects);
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async getProjectById(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const project = await this.projectService.getProjectById(projectId);
      if (project) {
        reply.send(project);
      } else {
        reply.status(404).send({ error: 'Project not found' });
      }
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async createProject(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const data = req.body as Project;
      const project = await this.projectService.createProject(data);
      reply.status(201).send(project);
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async updateProject(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const data = req.body as Project;
      const updatedProject = await this.projectService.updateProject(
        projectId,
        data,
      );
      if (updatedProject) {
        reply.send(updatedProject);
      } else {
        reply.status(404).send({ error: 'Project not found' });
      }
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async deleteProject(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const deletedProject = await this.projectService.deleteProject(projectId);
      if (deletedProject) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: 'Project not found' });
      }
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async getProjectBoards(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const boards = await this.projectService.getProjectBoards(projectId);
      reply.send(boards);
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async getProjectTasks(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const tasks = await this.projectService.getProjectTasks(projectId);
      reply.send(tasks);
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async getProjectFeedback(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const feedback = await this.projectService.getProjectFeedback(projectId);
      reply.send(feedback);
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async getProjectRisks(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const risks = await this.projectService.getProjectRisks(projectId);
      reply.send(risks);
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async getProjectResourceAllocations(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const resourceAllocations =
        await this.projectService.getProjectResourceAllocations(projectId);
      reply.send(resourceAllocations);
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async getProjectTeams(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const teams = await this.projectService.getProjectTeams(projectId);
      reply.send(teams);
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async getProjectComments(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const comments = await this.projectService.getProjectComments(projectId);
      reply.send(comments);
    } catch (error) {
      this.handleError(reply, error);
    }
  }

  public async getProjectChangeLogs(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const changeLogs =
        await this.projectService.getProjectChangeLogs(projectId);
      reply.send(changeLogs);
    } catch (error) {
      this.handleError(reply, error);
    }
  }
}
