import { genAI } from '../lib/geminiClient';

const CATEGORIES = ['Geral', 'Criatividade', 'Técnico', 'Aprendizado', 'Desenvolvimento'];

// Use a specific model for this fast task
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function categorizeConversation(messages) {
  // Get the content of the first two messages to provide context
  const context = messages.slice(0, 2).map(msg => `${msg.role}: ${msg.content}`).join('\n');

  const prompt = `
    You are a text categorization assistant.
    Analyze the following conversation and determine the main topic.
    Respond ONLY with ONE of the following words: ${CATEGORIES.join(', ')}.

    CONVERSATION:
    ---
    ${context}
    ---
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let category = response.text().trim().toLowerCase();

    // Ensure the response is one of the valid categories
    if (CATEGORIES.includes(category)) {
      console.log('Conversation categorized as:', category);
      return category;
    } else {
      console.log('Category not recognized, using "general"');
      return 'general'; // Default category
    }
  } catch (error) {
    console.error("Error categorizing conversation:", error);
    return 'general'; // Default category in case of error
  }
}

