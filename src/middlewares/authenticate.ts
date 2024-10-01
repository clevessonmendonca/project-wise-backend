import { FastifyRequest, FastifyReply } from 'fastify';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers['authorization']?.split(' ')[1];

  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const decoded = verify(token, JWT_SECRET_KEY) as JwtPayload;
    // @ts-ignore
    request.user = { id: decoded.sub };
  } catch (error) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}
