import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { genAI } from '../lib/geminiClient';
import { checkMessageLimit } from '../lib/limit';
import { personas } from '../lib/personas.jsx';

// Helper function to convert a File object to a Gemini-compatible generative part.
async function fileToGenerativePart(file) {
  const base64EncodedData = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: base64EncodedData, mimeType: file.type },
  };
}

export function useStreaming({ session, conversationId, saveConversation, isProUser, messages, setMessages }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const stopStream = useRef(false);

  const handleSend = async (activePersona, selectedModel, textInput, imageFile) => {
    if ((!textInput.trim() && !imageFile) || isLoading || isStreaming) return null;

    setIsLoading(true);
    stopStream.current = false;

    const canSend = await checkMessageLimit(session, isProUser);
    if (!canSend) {
      setIsLoading(false);
      return null;
    }

    const userMessage = {
      role: 'user',
      content: textInput,
      timestamp: new Date().toISOString(),
      // Create a local URL for immediate UI preview
      ...(imageFile && { image: URL.createObjectURL(imageFile) }),
    };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);

    try {
      let contextForAI = textInput;
      // Web search doesn't support images yet in this implementation
      if (activePersona === 'webSearch' && !conversationId && !imageFile) {
        setCurrentStatus('Pesquisando na web...');
        const { data, error } = await supabase.functions.invoke('web-search-agent', {
          body: { query: textInput },
        });
        if (error) throw new Error(`Erro no agente de pesquisa: ${error.message}`);
        contextForAI = `Com base nas seguintes informações da internet, responda à pergunta do usuário...`; // Simplified
      }

      setCurrentStatus('Gerando resposta...');

      // TODO: Update history to support multimodal messages
      const apiHistory = currentMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content || '' }] // Ensure content is not undefined
      }));

      const modelToUse = conversationId ? (await supabase.from('conversations').select('model').eq('id', conversationId).single()).data.model : selectedModel;
      const personaPrompt = personas[activePersona]?.prompt;
      const modelName = modelToUse === 'pro' && isProUser ? 'gemini-1.5-pro-latest' : 'gemini-1.5-flash-latest';

      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: personaPrompt,
      });

      const promptParts = [contextForAI];
      if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        promptParts.push(imagePart);
      }

      const chat = model.startChat({ history: apiHistory });
      const result = await chat.sendMessageStream(promptParts);

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

      // Add the image to the final message object for saving
      const finalUserMessage = { ...userMessage, ...(imageFile && { image: 'image_placeholder' }) }; // Don't save blob URL
      const finalMessages = [...messages.slice(0, -1), finalUserMessage, { role: 'assistant', content: text, timestamp: new Date().toISOString() }];
      const newConversationId = await saveConversation(finalMessages, conversationId, modelToUse);

      if (!isProUser && (!conversationId || modelToUse === 'flash')) {
        await supabase.rpc('increment_and_update_date', { user_id_arg: session.user.id });
      }

      return newConversationId;

    } catch (error) {
      console.error('Erro no handleSend:', error);
      toast.error(`Ocorreu um erro: ${error.message}`);
      setMessages(messages); // Revert
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

  return { isLoading, isStreaming, currentStatus, handleSend, handleStop };
}