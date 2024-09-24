import prisma from '../../models/prismaClient';
import { PasswordService } from '../../utils/passwordService';
import { ServerError, ValidationError } from '../../validationErrors';
import { CreateUserBody, UpdateUserBody } from '../../validationSchemas';
import { User } from '@prisma/client';

export class UserService {
  public async getAllUsers() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  public async getUserById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  public async createUser(data: CreateUserBody) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        console.log('User already exists with email:', data.email);
        throw new ValidationError('Email already in use');
      }

      const password = await PasswordService.hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          ...data,
          password,
        },
      });

      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: process.env.DEFAULT_USER_ROLE_ID!,
        },
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ServerError('Failed to create user');
    }
  }

  public async updateUser(id: string, data: UpdateUserBody) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  public async deleteUser(id: string) {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user by email');
    }
  }
}
