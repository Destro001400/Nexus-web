import { GoogleGenerativeAI } from '@google/generative-ai';

// Puxa a chave da API do mesmo lugar que o resto do app
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
// Usamos um modelo específico para essa tarefa rápida
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const CATEGORIES = ['research', 'creative', 'music', 'code', 'general'];

export async function categorizeConversation(messages) {
  // Pega o conteúdo das duas primeiras mensagens para dar contexto
  const context = messages.slice(0, 2).map(msg => `${msg.role}: ${msg.content}`).join('\n');

  const prompt = `
    Você é um assistente de categorização de texto.
    Analise a seguinte conversa e determine o tópico principal.
    Responda APENAS com UMA das seguintes palavras: ${CATEGORIES.join(', ')}.

    CONVERSA:
    ---
    ${context}
    ---
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let category = response.text().trim().toLowerCase();

    // Garante que a resposta seja uma das categorias válidas
    if (CATEGORIES.includes(category)) {
      console.log('Conversa categorizada como:', category);
      return category;
    } else {
      console.log('Categoria não reconhecida, usando "geral"');
      return 'general'; // Categoria padrão
    }
  } catch (error) {
    console.error("Erro ao categorizar conversa:", error);
    return 'general'; // Categoria padrão em caso de erro
  }
}
