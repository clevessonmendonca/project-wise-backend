import prisma from '../models/prismaClient';
import { ServerError, ValidationError } from '../validationErrors';
import { CreateWorkspaceBody, UpdateWorkspaceBody } from '../validationSchemas';
import { Workspace } from '@prisma/client';

export class WorkspaceService {
  public async getAllWorkspaces() {
    try {
      return await prisma.workspace.findMany();
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      throw new Error('Failed to fetch workspaces');
    }
  }

  public async getWorkspaceById(id: string) {
    try {
      return await prisma.workspace.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Error fetching workspace:', error);
      throw new Error('Failed to fetch workspace');
    }
  }

  public async createWorkspace(data: CreateWorkspaceBody) {
    try {
      const workspace = await prisma.workspace.create({
        data: {
          ...data,
        },
      });
      return workspace;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw new ServerError('Failed to create workspace');
    }
  }

  public async updateWorkspace(id: string, data: UpdateWorkspaceBody) {
    try {
      return await prisma.workspace.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error updating workspace:', error);
      throw new Error('Failed to update workspace');
    }
  }

  public async deleteWorkspace(id: string) {
    try {
      return await prisma.workspace.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting workspace:', error);
      throw new Error('Failed to delete workspace');
    }
  }
}
