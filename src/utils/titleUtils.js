import { generateTitle } from './titleGenerator';
import { categorizeConversation } from './categorizer';
import { UI_TEXTS } from '../constants/appConstants';

export const generateTitleAndCategory = async (messages) => {
  if (!messages || messages.length === 0) {
    return { title: UI_TEXTS.NEW_CHAT, category: 'general' };
  }

  try {
    // These can run in parallel
    const [title, category] = await Promise.all([
      generateTitle(messages),
      categorizeConversation(messages)
    ]);
    return { title, category };
  } catch (error) {
    console.error("Error generating title or category:", error);
    // Return default values in case of an error
    return { title: 'Conversa', category: 'general' };
  }
};
