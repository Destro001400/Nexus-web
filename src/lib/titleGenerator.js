import { genAI } from './geminiClient';

/**
 * Generates a short, objective title for a conversation based on its first few messages.
 * @param {Array<Object>} messages - The array of messages in the conversation.
 * @returns {Promise<string>} A promise that resolves to the generated title.
 */
export const generateTitle = async (messages) => {
  const context = messages.slice(0, 2).map(msg => `${msg.role}: ${msg.content}`).join('\n');
  const prompt = `Analise a conversa a seguir e crie um título curto e objetivo para ela com no máximo 5 palavras. Responda APENAS com o título.`;

  try {
    // Note: Using the 'flash' model for cost-effectiveness and speed.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    const result = await model.generateContent(`${prompt}\n\nCONVERSA:\n---\n${context}\n---`);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error generating title:", error);
    return "Nova Conversa"; // Fallback title
  }
};
