import prisma from '../../models/prismaClient';
import { ServerError, ValidationError } from '../../errors/validationErrors';
import { CreateRoleBody, UpdateRoleBody } from '../../errors/validationSchemas';

export class RoleService {
  public async createRole(data: CreateRoleBody) {
    try {
      return await prisma.role.create({
        data,
      });
    } catch (error) {
      console.error('Error creating role:', error);
      throw new Error('Failed to create role');
    }
  }

  public async getRoles() {
    try {
      return await prisma.role.findMany();
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw new Error('Failed to fetch roles');
    }
  }

  public async updateRole(id: string, data: UpdateRoleBody) {
    try {
      return await prisma.role.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      throw new Error('Failed to update role');
    }
  }

  public async deleteRole(id: string) {
    try {
      return await prisma.role.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      throw new Error('Failed to delete role');
    }
  }

  public async assignRole(userId: string, roleId: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: { permissions: true },
          },
        },
      });

      if (!user) {
        throw new ValidationError('User not found');
      }

      const permissions = user.roles.flatMap((role) =>
        role.permissions.map((permission) => permission.name),
      );

      if (!permissions.includes('admin:assign_roles')) {
        throw new ValidationError('Forbidden');
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          roles: {
            connect: { id: roleId },
          },
        },
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ServerError('Failed to assign role');
    }
  }
}
