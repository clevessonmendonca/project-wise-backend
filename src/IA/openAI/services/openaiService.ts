import { OPENAI_MODEL } from '../../../config';
import openai from '../openaiConfig';

export const generateResponse = async (prompt: string) => {
  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'Você é um assistente útil.' },
        { role: 'user', content: prompt },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    if (isOpenAIError(error)) {
      console.error('Erro ao gerar resposta da IA:', error.response?.data);
      throw new Error('Erro ao processar a resposta da IA');
    } else if (error instanceof Error) {
      console.error('Erro:', error.message);
      throw new Error('Erro desconhecido');
    } else {
      console.error('Erro inesperado:', error);
      throw new Error('Erro desconhecido');
    }
  }
};

// async function getAiSuggestion(taskData: any) {
//   const response = await openai.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages: [
//       { role: 'system', content: 'Você é um assistente que fornece sugestões de melhorias para projetos.' },
//       { role: 'user', content: `A tarefa atual é: ${taskData.title}. Descrição: ${taskData.description}.` },
//     ],
//   });

//   return response.data.choices[0].message.content;
// }

function isOpenAIError(error: any): error is { response?: { data: any } } {
  return error && typeof error === 'object' && 'response' in error;
}
