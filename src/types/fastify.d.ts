import 'fastify';
import { OAuth2Namespace } from '@fastify/oauth2';
import { JwtPayload } from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }

  interface FastifyRequest {
    user: JwtPayload; 
  }
}
