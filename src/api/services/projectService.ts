import { Project } from '@prisma/client';
import prisma from '../../models/prismaClient';

export class ProjectService {
  public async getAllProjects(workspaceId: string) {
    try {
      return await prisma.project.findMany({
        where: { workspaceId },
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  public async getProjectById(id: string) {
    try {
      return await prisma.project.findUnique({
        where: { id },
        include: this.getProjectRelations(),
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }
  }

  public async createProject(data: Project) {
    const startDateTime = new Date(data?.startDate).toISOString();
    const endDateTime = new Date(data?.endDate).toISOString();

    try {
      return await prisma.project.create({
        data: {
          name: data.name,
          description: data.description,
          startDate: startDateTime,
          endDate: endDateTime,
          budget: data.budget,
          status: data.status,
          functionalRequirements: data.functionalRequirements,
          nonFunctionalRequirements: data.nonFunctionalRequirements,
          workspace: { connect: { id: data.workspaceId } },
        },
      });
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  public async updateProject(id: string, data: any) {
    try {
      return await prisma.project.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  public async deleteProject(id: string) {
    try {
      return await prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  }

  public async getProjectBoards(projectId: string) {
    try {
      return await prisma.board.findMany({
        where: { projectId },
      });
    } catch (error) {
      console.error('Error fetching project boards:', error);
      throw new Error('Failed to fetch project boards');
    }
  }

  public async getProjectTasks(projectId: string) {
    try {
      return await prisma.task.findMany({
        where: {
          board: {
            projectId,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      throw new Error('Failed to fetch project tasks');
    }
  }

  public async getProjectFeedback(projectId: string) {
    try {
      return await prisma.feedback.findMany({
        where: { projectId },
      });
    } catch (error) {
      console.error('Error fetching project feedback:', error);
      throw new Error('Failed to fetch project feedback');
    }
  }

  public async getProjectRisks(projectId: string) {
    try {
      return await prisma.risk.findMany({
        where: { projectId },
      });
    } catch (error) {
      console.error('Error fetching project risks:', error);
      throw new Error('Failed to fetch project risks');
    }
  }

  public async getProjectResourceAllocations(projectId: string) {
    try {
      return await prisma.resourceAllocation.findMany({
        where: { projectId },
      });
    } catch (error) {
      console.error('Error fetching project resource allocations:', error);
      throw new Error('Failed to fetch project resource allocations');
    }
  }

  public async getProjectTeams(projectId: string) {
    try {
      return await prisma.team.findMany({
        where: { projectId },
      });
    } catch (error) {
      console.error('Error fetching project teams:', error);
      throw new Error('Failed to fetch project teams');
    }
  }

  public async getProjectComments(projectId: string) {
    try {
      return await prisma.comment.findMany({
        where: {
          projectId, // Correção aqui
        },
      });
    } catch (error) {
      console.error('Error fetching project comments:', error);
      throw new Error('Failed to fetch project comments');
    }
  }

  public async getProjectChangeLogs(projectId: string) {
    try {
      return await prisma.changeLog.findMany({
        where: {
          project: {
            id: projectId,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching project change logs:', error);
      throw new Error('Failed to fetch project change logs');
    }
  }

  private getProjectRelations() {
    return {
      boards: true,
      feedback: true,
      risks: true,
      resourceAllocations: true,
      teams: true,
      comments: true,
      changeLogs: true,
    };
  }
}
