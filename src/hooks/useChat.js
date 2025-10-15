import { useState } from 'react';
import { useMessageHistory } from './useMessageHistory';
import { useStreaming } from './useStreaming';

export function useChat(session, conversationId, saveConversation, isProUser) {
  const { messages, setMessages, loadConversationHistory, isLoadingHistory } = useMessageHistory(conversationId);
  const [input, setInput] = useState('');

  const {
    isLoading: isLoadingSend,
    isStreaming,
    currentStatus,
    handleSend: streamSend,
    handleStop
  } = useStreaming({
    session,
    conversationId,
    saveConversation,
    isProUser,
    messages,
    setMessages,
  });

  const handleSend = async (activePersona, selectedModel) => {
    if (!input.trim()) return null;
    
    const originalInput = input;
    setInput('');

    return await streamSend(activePersona, selectedModel, originalInput, null);
  };

  return {
    messages,
    input,
    setInput,
    isLoading: isLoadingHistory || isLoadingSend,
    isStreaming,
    currentStatus,
    loadConversationHistory,
    handleSend,
    handleStop,
  };
}
