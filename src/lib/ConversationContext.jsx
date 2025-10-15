import React, { createContext } from 'react';
import { useConversation } from '../hooks/useConversation';
import { useAuth } from '../hooks/useAuth';

const ConversationContext = createContext();


export const ConversationProvider = ({ children }) => {
  const { session } = useAuth();
  const conversationData = useConversation(session);

  return (
    <ConversationContext.Provider value={conversationData}>
      {children}
    </ConversationContext.Provider>
  );
};
