import openai from '../openaiConfig';

export const handleOpenAIChat = async (message: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    throw new Error('Erro ao processar sua solicitação.');
  }
};
