import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/env';
import { FastifyRequest, FastifyReply } from 'fastify';

export const authHook = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (request.originalUrl === '/login') {
    return;
  }
  const token = request.headers['authorization']?.split(' ')[1];
  if (!token) {
    return reply.status(401).send({ error: 'Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as { sub: string };
    // @ts-ignore
    request.user = decoded.sub;
  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido ou expirado' });
  }
};
