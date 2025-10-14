import React, { createContext, useContext } from 'react';
import { useConversation } from '../hooks/useConversation';
import { useAuth } from './AuthContext';

const ConversationContext = createContext();

export const useConversationContext = () => useContext(ConversationContext);

export const ConversationProvider = ({ children }) => {
  const { session } = useAuth();
  const conversationData = useConversation(session);

  return (
    <ConversationContext.Provider value={conversationData}>
      {children}
    </ConversationContext.Provider>
  );
};
