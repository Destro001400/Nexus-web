import { useContext } from 'react';
import { ConversationContext } from '../lib/ConversationContext';

export const useConversationContext = () => useContext(ConversationContext);