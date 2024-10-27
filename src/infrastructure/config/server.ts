import fastify from 'fastify';
import cors from '@fastify/cors';
import FastifyOauth2 from '@fastify/oauth2';
import authRoutes from '../../api/routes/authRoutes';
import boardRoutes from '../../api/routes/boardRoutes';
import profileRoutes from '../../api/routes/profileRoutes';
import projectRoutes from '../../api/routes/projectRoutes';
import roleRoutes from '../../api/routes/roleRoutes';
import taskRoutes from '../../api/routes/taskRoutes';
import userRoutes from '../../api/routes/userRoutes';
import workspaceRoutes from '../../api/routes/workspaceRoutes';
import { setupWebSocket } from '../../websocket/ws';

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

app.register(authRoutes);
app.register(profileRoutes, { prefix: '/profile' });
app.register(userRoutes, { prefix: '/users' });
app.register(roleRoutes, { prefix: '/roles' });
app.register(projectRoutes, { prefix: '/projects' });
app.register(boardRoutes, { prefix: '/boards' });
app.register(taskRoutes, { prefix: '/tasks' });
app.register(workspaceRoutes, { prefix: '/workspace' });

setupWebSocket(app);
