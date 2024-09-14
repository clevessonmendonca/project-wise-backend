import fastify from 'fastify';
import cors from '@fastify/cors';
import FastifyOauth2 from '@fastify/oauth2';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import boardRoutes from './routes/boardRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import './config/index';
import profileRoutes from './routes/profileRoutes';
import { authHook } from './middleware/accessToken';

export const app = fastify();

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

app.register(FastifyOauth2, {
  name: 'googleOAuth2',
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID as string,
      secret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    auth: FastifyOauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/login/google',
  callbackUri: 'http://localhost:5000/login/google/callback',
  scope: ['profile', 'email'],
});

// app.addHook('preHandler', authHook);

app.register(authRoutes);
app.register(profileRoutes, { prefix: '/profile' });
app.register(userRoutes, { prefix: '/users' });
app.register(roleRoutes, { prefix: '/roles' });
app.register(projectRoutes, { prefix: '/projects' });
app.register(boardRoutes, { prefix: '/boards' });
app.register(taskRoutes, { prefix: '/tasks' });
app.register(workspaceRoutes, { prefix: '/workspace' });

async function start() {
  try {
    const address = await app.listen({ port: 5000 });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
