import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../../config/env';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

if (!OPENAI_API_KEY) {
  throw new Error('A chave da API OpenAI não está configurada.');
}

export default openai;
