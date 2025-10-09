import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Send, Sparkles, Loader2, LogOut, Menu, Copy, Check, Square, Zap, Gem, FileText, Music, Code, Globe } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Chat.css';
import { categorizeConversation } from '../lib/categorizer.js';
import { checkMessageLimit } from '../lib/limit.js';
import Personas, { personas } from './Personas';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import MessageList from './MessageList';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const promptSuggestions = [
    { icon: <FileText size={18} />, text: "Resuma este artigo para mim..." },
    { icon: <Music size={18} />, text: "Crie uma letra de música sobre..." },
    { icon: <Code size={18} />, text: "Explique o que este código faz..." },
    { icon: <Globe size={18} />, text: "Quais as últimas notícias sobre..." },
];

const generateTitle = async (messages) => {
    const context = messages.slice(0, 2).map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const prompt = `Analise a conversa a seguir e crie um título curto e objetivo para ela com no máximo 5 palavras. Responda APENAS com o título.`;
    try {
        // CORREÇÃO AQUI
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt + `\n\nCONVERSA:\n---\n${context}\n---`);
        return result.response.text().trim();
    } catch (error) {
        console.error("Erro ao gerar título:", error);
        return "Nova Conversa";
    }
};



export default function Chat({ session, conversationId, onConversationCreated, onToggleSidebar, isProUser }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('');
    const [selectedModel, setSelectedModel] = useState('flash');
    const [activePersona, setActivePersona] = useState('general');
    const messagesEndRef = useRef(null);
    const stopStream = useRef(false);

    useEffect(() => {
        const loadConversationHistory = async () => {
            if (!conversationId) {
                setMessages([]);
                return;
            }
            setIsLoading(true);
            const { data, error } = await supabase.from('conversations').select('messages').eq('id', conversationId).single();
            setIsLoading(false);
            if (error) {
                console.error("Erro ao buscar histórico da conversa:", error);
                toast.error("Não foi possível carregar as mensagens.");
                return;
            }
            setMessages(data?.messages || []);
        };
        loadConversationHistory();
    }, [conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const saveConversation = async (updatedMessages, currentConvoId, modelToSave) => {
        try {
            let dataToSave = { messages: updatedMessages, updated_at: new Date() };
            if (currentConvoId) {
                await supabase.from('conversations').update(dataToSave).eq('id', currentConvoId);
            } else {
                dataToSave.model = modelToSave;
                const title = await generateTitle(updatedMessages);
                const category = await categorizeConversation(updatedMessages);
                dataToSave.title = title;
                dataToSave.category = category;
                const { data, error } = await supabase.from('conversations').insert([{ ...dataToSave, user_id: session.user.id }]).select('id').single();
                if (error) {
                    throw error;
                }
                if (data) onConversationCreated(data.id);
            }
        } catch (error) {
            console.error("Erro ao salvar conversa, título ou categoria:", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading || isStreaming) return;
    
        setIsLoading(true);
        stopStream.current = false;
    
        const canSend = await checkMessageLimit(session, isProUser);
        if (!canSend) {
            setIsLoading(false);
            return;
        }
    
        const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        const originalInput = input;
        setInput('');
    
        try {
            let contextForAI = "";
            if (activePersona === 'webSearch' && !conversationId) {
                setCurrentStatus('Pesquisando na web...');
                const { data, error } = await supabase.functions.invoke('web-search-agent', {
                    body: { query: originalInput },
                });
    
                if (error) throw new Error(`Erro no agente de pesquisa: ${error.message}`);
                
                contextForAI = `Com base nas seguintes informações da internet, responda à pergunta do usuário de forma completa e cite as fontes quando relevante. \n\nINFORMAÇÕES DA WEB:\n---\n${data.context}\n---\n\nPERGUNTA DO USUÁRIO: ${originalInput}`;
            } else {
                contextForAI = originalInput;
            }
    
            setCurrentStatus('Gerando resposta...');
    
            const apiHistory = currentMessages.slice(0, -1).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));
    
            const modelToUse = conversationId ? (await supabase.from('conversations').select('model').eq('id', conversationId).single()).data.model : selectedModel;
            const personaPrompt = personas[activePersona]?.prompt;
            
            // CORREÇÃO PRINCIPAL AQUI, NOS NOMES DOS MODELOS
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
            
            await saveConversation(finalMessages, conversationId, modelToUse);
    
            if (!isProUser && (!conversationId || modelToUse === 'flash')) {
                await supabase.rpc('increment_and_update_date', { user_id_arg: session.user.id });
            }
    
        } catch (error) {
            console.error('Erro no handleSend:', error);
            toast.error(`Ocorreu um erro: ${error.message}`);
            setMessages(messages);
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
            setCurrentStatus('');
        }
    };
    
    const handleStop = () => { stopStream.current = true; };
    const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
    const handleSuggestionClick = (suggestionText) => { setInput(suggestionText); };

    return (
        <div className="chat-app">
            <ChatHeader session={session} onToggleSidebar={onToggleSidebar} />
            
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
                  />
                )}
            </main>
                        <ChatInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                handleKeyPress={handleKeyPress}
                isStreaming={isStreaming}
                handleStop={handleStop}
                isLoading={isLoading}
            />
        </div>
    );
}