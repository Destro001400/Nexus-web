import { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import Personas from './Personas';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import MessageList from './MessageList';
import { exportAsTxt, exportAsMarkdown, exportAsPdf } from '../lib/exportConversation';
import { toast } from 'react-hot-toast';
import { FileText, Music, Code, Globe } from 'lucide-react';
import './Chat.css';

const promptSuggestions = [
    { icon: <FileText size={18} />, text: "Resuma este artigo para mim..." },
    { icon: <Music size={18} />, text: "Crie uma letra de música sobre..." },
    { icon: <Code size={18} />, text: "Explique o que este código faz..." },
    { icon: <Globe size={18} />, text: "Quais as últimas notícias sobre..." },
];

export default function Chat({ session, conversationId, saveConversation, onConversationCreated, onToggleSidebar, isProUser }) {
    const [selectedModel, setSelectedModel] = useState('flash');
    const [activePersona, setActivePersona] = useState('general');
    const messagesEndRef = useRef(null);

    const {
        messages,
        input,
        setInput,
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

    const handleExport = () => {
        if (!messages.length) return toast('Nada para exportar!');
        const option = window.prompt('Exportar como: 1) TXT  2) Markdown  3) PDF', '1');
        if (option === '1') exportAsTxt(messages);
        else if (option === '2') exportAsMarkdown(messages);
        else if (option === '3') exportAsPdf(messages);
        else toast('Exportação cancelada.');
    };

    return (
        <div className="chat-app">
            <ChatHeader session={session} onToggleSidebar={onToggleSidebar} onExport={handleExport} />
            
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
                handleSend={handleSendClick}
                handleKeyPress={handleKeyPress}
                isStreaming={isStreaming}
                handleStop={handleStop}
                isLoading={isLoading}
            />
        </div>
    );
}
