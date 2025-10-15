import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth'; // Import useAuth
import { useConversationContext } from '../hooks/useConversationContext';
import { useChat } from '../hooks/useChat';
import Personas from './Personas';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import MessageList from './MessageList';

import { FileText, Music, Code, Globe } from 'lucide-react';
import './Chat.css';

const promptSuggestions = [
    { icon: <FileText size={18} />, text: "Resuma este artigo para mim..." },
    { icon: <Music size={18} />, text: "Crie uma letra de música sobre..." },
    { icon: <Code size={18} />, text: "Explique o que este código faz..." },
    { icon: <Globe size={18} />, text: "Quais as últimas notícias sobre..." },
];

export default function Chat({ conversationId, onConversationCreated, isProUser }) {
    const { session } = useAuth(); // Use the hook
    const { saveConversation } = useConversationContext();
    const [selectedModel, setSelectedModel] = useState('flash');
    const [activePersona, setActivePersona] = useState('general');
    const messagesEndRef = useRef(null);

    const {
        messages,
        input,
        setInput,
        image,
        setImage,
        isLoading,
        isStreaming,
        currentStatus,
        loadConversationHistory,
        handleSend,
        handleStop,
    } = useChat(session, conversationId, saveConversation, isProUser);

    useEffect(() => {
        loadConversationHistory();
    }, [conversationId, loadConversationHistory]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendClick = async () => {
        const newConversationId = await handleSend(activePersona, selectedModel);
        if (newConversationId && !conversationId) {
            onConversationCreated(newConversationId);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    const handleSuggestionClick = (suggestionText) => {
        setInput(suggestionText);
    };

    return (
        <div className="chat-app">
            {!conversationId && (
                <Personas activePersona={activePersona} onSelectPersona={setActivePersona} />
            )}
            
            <main className="chat-container">
                {messages.length === 0 && !isLoading ? (
                    <WelcomeScreen
                        conversationId={conversationId}
                        selectedModel={selectedModel}
                        setSelectedModel={setSelectedModel}
                        isProUser={isProUser}
                        promptSuggestions={promptSuggestions}
                        handleSuggestionClick={handleSuggestionClick}
                    />
                ) : (
                    <MessageList
                        messages={messages}
                        isLoading={isLoading}
                        currentStatus={currentStatus}
                        messagesEndRef={messagesEndRef}
                        conversationId={conversationId}
                        userId={session?.user?.id}
                    />
                )}
            </main>
            <ChatInput
                input={input}
                setInput={setInput}
                image={image}
                setImage={setImage}
                handleSend={handleSendClick}
                handleKeyPress={handleKeyPress}
                isStreaming={isStreaming}
                handleStop={handleStop}
                isLoading={isLoading}
            />
        </div>
    );
}
