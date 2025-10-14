import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Keep for real-time
import {
  fetchConversations as fetchConversationsApi,
  saveConversation as saveConversationApi,
  deleteConversation as deleteConversationApi,
} from '../utils/conversationApi';

export function useConversation(session) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchConversationsApi(userId)
      .then(setConversations)
      .catch(() => { /* Error is toasted in the API util */ })
      .finally(() => setLoading(false));

    const channel = supabase
      .channel(`public:conversations:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Real-time change received!', payload);
          if (payload.eventType === 'INSERT') {
            setConversations(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setConversations(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
          } else if (payload.eventType === 'DELETE') {
            setConversations(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const saveConversation = useCallback(async (messages, conversationId, model) => {
    if (!userId) return null;
    // The API function will handle UI updates (toasts) and return the id.
    // The real-time subscription will handle the state update.
    return await saveConversationApi(userId, messages, conversationId, model);
  }, [userId]);

  const deleteConversation = useCallback(async (conversationId) => {
    if (!userId) return;
    try {
      await deleteConversationApi(conversationId);
    } catch (error) {
      // Errors are handled in the API util
    }
  }, [userId]);

  return {
    conversations,
    loadingConversations: loading,
    saveConversation,
    deleteConversation,
  };
}
