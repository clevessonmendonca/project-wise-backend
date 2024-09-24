import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';
import prisma from '../models/prismaClient';

export function checkPermissions(requiredPermissions: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers['authorization'];
      if (!authHeader) {
        reply.status(401).send({ error: 'No token provided' });
        return;
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        reply.status(401).send({ error: 'No token provided' });
        return;
      }

      const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
      const userId = decoded.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              permissions: true,
            },
          },
        },
      });

      if (!user) {
        reply.status(401).send({ error: 'User not found' });
        return;
      }

      const userPermissions = user.roles.flatMap((role) =>
        role.permissions.map((permission) => permission.name),
      );

      const hasPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasPermission) {
        reply.status(403).send({ error: 'Forbidden' });
        return;
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      reply.status(401).send({ error: 'Unauthorized' });
    }
  };
}
