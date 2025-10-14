import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { UI_TEXTS } from '../constants/appConstants';

export function useMessageHistory(conversationId) {
  const [messages, setMessages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const loadConversationHistory = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setIsLoadingHistory(true);
    const { data, error } = await supabase
      .from('conversations')
      .select('messages')
      .eq('id', conversationId)
      .single();
    
    setIsLoadingHistory(false);

    if (error) {
      toast.error(UI_TEXTS.ERROR_LOADING_MESSAGES);
      console.error("Error loading conversation history:", error);
      return;
    }
    setMessages(data?.messages || []);
  }, [conversationId]);

  return { messages, setMessages, loadConversationHistory, isLoadingHistory };
}
