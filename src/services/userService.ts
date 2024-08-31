import prisma from '../models/prismaClient';
import { CreateUserBody, UpdateUserBody } from '../types';

export class UserService {
  public async getAllUsers() {
    return prisma.user.findMany();
  }

  public async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public async createUser(data: CreateUserBody) {
    return prisma.user.create({
      data,
    });
  }

  public async updateUser(id: string, data: UpdateUserBody) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  public async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
