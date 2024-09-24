import { FastifyRequest, FastifyReply } from 'fastify';
import { ProjectService } from '../services/projectService';
import { ZodError } from 'zod';
import { Project } from '@prisma/client';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
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
      console.error('Error fetching projects:', error);
      reply.status(500).send({ error: 'Failed to fetch projects' });
    }
  }

  public async getProjectById(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const project = await this.projectService.getProjectById(id);
      if (project) {
        reply.send(project);
      } else {
        reply.status(404).send({ error: 'Project not found' });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      reply.status(500).send({ error: 'Failed to fetch project' });
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
      if (error instanceof ZodError) {
        reply
          .status(400)
          .send({ error: 'Invalid project data', details: error.errors });
      } else {
        console.error('Error creating project:', error);
        reply.status(500).send({ error: 'Failed to create project' });
      }
    }
  }

  public async updateProject(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const data = req.body as Project;
      const updatedProject = await this.projectService.updateProject(id, data);
      if (updatedProject) {
        reply.send(updatedProject);
      } else {
        reply.status(404).send({ error: 'Project not found' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        reply
          .status(400)
          .send({ error: 'Invalid project data', details: error.errors });
      } else {
        console.error('Error updating project:', error);
        reply.status(500).send({ error: 'Failed to update project' });
      }
    }
  }

  public async deleteProject(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { id } = req.params as { id: string };
    try {
      const deletedProject = await this.projectService.deleteProject(id);
      if (deletedProject) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: 'Project not found' });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      reply.status(500).send({ error: 'Failed to delete project' });
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
      console.error('Error fetching project boards:', error);
      reply.status(500).send({ error: 'Failed to fetch project boards' });
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
      console.error('Error fetching project tasks:', error);
      reply.status(500).send({ error: 'Failed to fetch project tasks' });
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
      console.error('Error fetching project feedback:', error);
      reply.status(500).send({ error: 'Failed to fetch project feedback' });
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
      console.error('Error fetching project risks:', error);
      reply.status(500).send({ error: 'Failed to fetch project risks' });
    }
  }

  public async getProjectResourceAllocations(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const resourceAllocations = await this.projectService.getProjectResourceAllocations(projectId);
      reply.send(resourceAllocations);
    } catch (error) {
      console.error('Error fetching project resource allocations:', error);
      reply.status(500).send({ error: 'Failed to fetch project resource allocations' });
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
      console.error('Error fetching project teams:', error);
      reply.status(500).send({ error: 'Failed to fetch project teams' });
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
      console.error('Error fetching project comments:', error);
      reply.status(500).send({ error: 'Failed to fetch project comments' });
    }
  }

  public async getProjectChangeLogs(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { projectId } = req.params as { projectId: string };
    try {
      const changeLogs = await this.projectService.getProjectChangeLogs(projectId);
      reply.send(changeLogs);
    } catch (error) {
      console.error('Error fetching project change logs:', error);
      reply.status(500).send({ error: 'Failed to fetch project change logs' });
    }
  }
}
