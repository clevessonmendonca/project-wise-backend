import { FastifyInstance } from 'fastify';
import { generateResponse } from '../services/openaiService';

async function openaiRoutes(app: FastifyInstance) {
  app.post('/generate', async (request, reply) => {
    const { prompt } = request.body as { prompt: string };

    if (!prompt || prompt.length < 5) {
      return reply.status(400).send({ error: 'Prompt é obrigatório e deve ter pelo menos 5 caracteres.' });
    }

    try {
      const response = await generateResponse(prompt);
      return reply.status(200).send({ response });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido.';
      console.error('Erro ao processar a requisição:', errorMessage);
      return reply.status(500).send({ error: errorMessage });
    }
  });
}

export default openaiRoutes;
