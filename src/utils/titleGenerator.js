import { genAI } from '../lib/geminiClient';

/**
 * Generates a short, objective title for a conversation based on its first few messages.
 * @param {Array<Object>} messages - The array of messages in the conversation.
 * @returns {Promise<string>} A promise that resolves to the generated title.
 */
export const generateTitle = async (messages) => {
  console.log("--- DEBUG: Iniciando geração de título... ---");
  const context = messages.slice(0, 2).map(msg => `${msg.role}: ${msg.content}`).join('\n');
  const prompt = `Analise a conversa a seguir e crie um título curto e objetivo para ela com no máximo 5 palavras. Responda APENAS com o título.`;

  console.log("CONTEXTO PARA TÍTULO:", context);
  console.log("PROMPT ENVIADO:", prompt);

  try {
    // Note: Using the 'flash' model for cost-effectiveness and speed.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    const result = await model.generateContent(`${prompt}\n\nCONVERSA:\n---\n${context}\n---`);
    console.log("RESPOSTA DA API:", JSON.stringify(result, null, 2));

    const title = result.response.text().trim();
    console.log("TÍTULO EXTRAÍDO:", title);
    return title;

  } catch (error) {
    console.error("--- DEBUG: ERRO AO GERAR TÍTULO: ---", error);
    return "Nova Conversa"; // Fallback title
  }
};
