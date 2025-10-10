import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { generateTitle } from '../lib/titleGenerator';
import { categorizeConversation } from '../lib/categorizer';

export function useConversation(session) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('conversations')
      .select('id, created_at, title, category, model')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Falha ao buscar o histórico de conversas.');
      console.error('Error fetching conversations:', error);
    } else {
      setConversations(data || []);
    }
    setLoading(false);
  }, [session]);

  // Effect to fetch initial data and subscribe to real-time changes
  useEffect(() => {
    if (!session) return;

    fetchConversations();

    const channel = supabase
      .channel(`public:conversations:user_id=eq.${session.user.id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations', filter: `user_id=eq.${session.user.id}` },
        (payload) => {
          console.log('Real-time change received!', payload);
          fetchConversations(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, fetchConversations]);

  const saveConversation = useCallback(async (messages, conversationId, model) => {
    // The real-time subscription will handle UI updates, so we don't need to call fetchConversations() here.
    if (!session) return null;

    try {
      const dataToSave = { messages, updated_at: new Date() };

      if (conversationId) {
        await supabase.from('conversations').update(dataToSave).eq('id', conversationId);
        return conversationId;
      } else {
        const title = await generateTitle(messages);
        const category = await categorizeConversation(messages);
        dataToSave.title = title;
        dataToSave.category = category;
        dataToSave.model = model;

        const { data, error } = await supabase
          .from('conversations')
          .insert([{ ...dataToSave, user_id: session.user.id }])
          .select('id')
          .single();

        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      toast.error('Erro ao salvar a conversa.');
      console.error('Error saving conversation:', error);
      return null;
    }
  }, [session]);

  const deleteConversation = useCallback(async (conversationId) => {
    // The real-time subscription will handle UI updates.
    if (!session) return;
    if (!window.confirm("Tem certeza que quer apagar esta conversa?")) return;

    try {
      await supabase.from('conversations').delete().eq('id', conversationId);
      toast.success('Conversa apagada.');
    } catch (error) {
      toast.error('Erro ao apagar a conversa.');
      console.error('Error deleting conversation:', error);
    }
  }, [session]);

  return { 
    conversations, 
    loadingConversations: loading, 
    saveConversation, 
    deleteConversation 
  };
}