"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const client_1 = require("@prisma/client");
const fastify = (0, fastify_1.default)({ logger: true });
const prisma = new client_1.PrismaClient();
fastify.get('/', async (request, reply) => {
    return { message: 'Hello, world!' };
});
fastify.get('/users', async (request, reply) => {
    const users = await prisma.user.findMany();
    return users;
});
fastify.get('/projects', async (request, reply) => {
    const projects = await prisma.project.findMany();
    return projects;
});
fastify.get('/tasks', async (request, reply) => {
    const tasks = await prisma.task.findMany();
    return tasks;
});
// Start the server
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server listening on http://localhost:3000');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map