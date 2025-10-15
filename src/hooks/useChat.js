import { useState } from 'react';
import { useMessageHistory } from './useMessageHistory';
import { useStreaming } from './useStreaming';

export function useChat(session, conversationId, saveConversation, isProUser) {
  const { messages, setMessages, loadConversationHistory, isLoadingHistory } = useMessageHistory(conversationId);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);

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
    if (!input.trim() && !image) return null;
    
    const originalInput = input;
    const originalImage = image;
    setInput('');
    setImage(null);

    return await streamSend(activePersona, selectedModel, originalInput, originalImage);
  };

  return {
    messages,
    input,
    setInput,
    image,
    setImage,
    isLoading: isLoadingHistory || isLoadingSend,
    isStreaming,
    currentStatus,
    loadConversationHistory,
    handleSend,
    handleStop,
  };
}
