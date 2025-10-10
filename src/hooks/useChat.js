import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { genAI } from '../lib/geminiClient';
import { checkMessageLimit } from '../lib/limit';
import { personas } from '../components/Personas';

export function useChat(session, conversationId, saveConversation, isProUser) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const stopStream = useRef(false);

  const loadConversationHistory = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase.from('conversations').select('messages').eq('id', conversationId).single();
    setIsLoading(false);
    if (error) {
      toast.error("Não foi possível carregar as mensagens.");
      console.error("Error loading conversation history:", error);
      return;
    }
    setMessages(data?.messages || []);
  }, [conversationId]);

  const handleSend = async (activePersona, selectedModel) => {
    if (!input.trim() || isLoading || isStreaming) return null;

    setIsLoading(true);
    stopStream.current = false;

    const canSend = await checkMessageLimit(session, isProUser);
    if (!canSend) {
      setIsLoading(false);
      return null;
    }

    const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    const originalInput = input;
    setInput('');

    try {
      let contextForAI = originalInput;
      if (activePersona === 'webSearch' && !conversationId) {
        setCurrentStatus('Pesquisando na web...');
        const { data, error } = await supabase.functions.invoke('web-search-agent', {
          body: { query: originalInput },
        });
        if (error) throw new Error(`Erro no agente de pesquisa: ${error.message}`);
        contextForAI = `Com base nas seguintes informações da internet, responda à pergunta do usuário de forma completa e cite as fontes quando relevante. 

INFORMAÇÕES DA WEB:
---
${data.context}
---

PERGUNTA DO USUÁRIO: ${originalInput}`;
      }

      setCurrentStatus('Gerando resposta...');

      const apiHistory = currentMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const modelToUse = conversationId ? (await supabase.from('conversations').select('model').eq('id', conversationId).single()).data.model : selectedModel;
      const personaPrompt = personas[activePersona]?.prompt;
      const modelName = modelToUse === 'pro' && isProUser ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: personaPrompt,
      });

      const chat = model.startChat({ history: apiHistory });
      const result = await chat.sendMessageStream(contextForAI);

      setIsLoading(false);
      setIsStreaming(true);
      setCurrentStatus('');

      let text = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date().toISOString() }]);

      for await (const chunk of result.stream) {
        if (stopStream.current) break;
        text += chunk.text();
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length) newMessages[newMessages.length - 1].content = text;
          return newMessages;
        });
      }

      const finalMessages = [...currentMessages, { role: 'assistant', content: text, timestamp: new Date().toISOString() }];
      const newConversationId = await saveConversation(finalMessages, conversationId, modelToUse);

      if (!isProUser && (!conversationId || modelToUse === 'flash')) {
        await supabase.rpc('increment_and_update_date', { user_id_arg: session.user.id });
      }

      return newConversationId;

    } catch (error) {
      console.error('Erro no handleSend:', error);
      toast.error(`Ocorreu um erro: ${error.message}`);
      setMessages(messages); // Revert to previous messages on error
      return null;
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setCurrentStatus('');
    }
  };

  const handleStop = () => {
    stopStream.current = true;
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    isStreaming,
    currentStatus,
    loadConversationHistory,
    handleSend,
    handleStop,
  };
}
