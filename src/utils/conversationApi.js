import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { UI_TEXTS } from '../constants/appConstants';
import { generateTitleAndCategory } from './titleUtils';

export const deleteConversation = async (conversationId) => {
  try {
    await supabase.from('conversations').delete().eq('id', conversationId);
    toast.success(UI_TEXTS.CONVERSATION_DELETED);
  } catch (error) {
    toast.error(UI_TEXTS.ERROR_DELETING_CONVERSATION);
    console.error('Error deleting conversation:', error);
    // Re-throw the error if you want the caller to be able to handle it
    throw error;
  }
};

export const fetchConversations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('id, created_at, title, category, model')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(UI_TEXTS.ERROR_FETCHING_HISTORY);
      console.error('Error fetching conversations:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    // This might be redundant if the above toast always triggers, but it's a safe fallback.
    toast.error(UI_TEXTS.ERROR_FETCHING_HISTORY);
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const saveConversation = async (userId, messages, conversationId, model) => {
  try {
    const dataToSave = { messages, updated_at: new Date() };

    if (conversationId) {
      // It's an existing conversation, just update the messages
      const { error } = await supabase.from('conversations').update(dataToSave).eq('id', conversationId);
      if (error) throw error;
      return conversationId;
    } else {
      // It's a new conversation, generate title and category
      const { title, category } = await generateTitleAndCategory(messages);
      dataToSave.title = title;
      dataToSave.category = category;
      dataToSave.model = model;

      const { data, error } = await supabase
        .from('conversations')
        .insert([{ ...dataToSave, user_id: userId }])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    }
  } catch (error) {
    toast.error(UI_TEXTS.ERROR_SAVING_CONVERSATION);
    console.error('Error saving conversation:', error);
    // Return null to indicate failure
    return null;
  }
};