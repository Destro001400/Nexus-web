import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, LogOut, Menu, Copy, Check, Square, Zap, Gem, FileText, Music, Code } from 'lucide-react';
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

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const promptSuggestions = [
    { icon: <FileText size={18} />, text: "Resuma este artigo para mim..." },
    { icon: <Music size={18} />, text: "Crie uma letra de música sobre..." },
    { icon: <Code size={18} />, text: "Explique o que este código faz..." },
    { icon: <Sparkles size={18} />, text: "Sugira 3 ideias de nome para..." },
];

const generateTitle = async (messages) => {
    const context = messages.slice(0, 2).map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const prompt = `Analise a conversa a seguir e crie um título curto e objetivo para ela com no máximo 5 palavras. Responda APENAS com o título.`;
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt + `\n\nCONVERSA:\n---\n${context}\n---`);
        return result.response.text().trim();
    } catch (error) {
        console.error("Erro ao gerar título:", error);
        return "Nova Conversa";
    }
};

const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const codeText = String(children).replace(/\n$/, '');
    const handleCopy = () => {
        navigator.clipboard.writeText(codeText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    return !inline && match ? ( <div className="code-block-wrapper"> <SyntaxHighlighter style={coldarkDark} language={match[1]} PreTag="div" {...props}>{codeText}</SyntaxHighlighter> <button className="copy-button" onClick={handleCopy}> {isCopied ? <Check size={16} /> : <Copy size={16} />} {isCopied ? 'Copiado!' : 'Copiar'} </button> </div> ) : ( <code className={className} {...props}>{children}</code> );
};

export default function Chat({ session, conversationId, onConversationCreated, onToggleSidebar, isProUser }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [selectedModel, setSelectedModel] = useState('flash');
    const [activePersona, setActivePersona] = useState('general');
    const messagesEndRef = useRef(null);
    const stopStream = useRef(false);

    // Efeito para carregar o histórico de uma conversa existente
    useEffect(() => {
        const loadConversationHistory = async () => {
            if (!conversationId) {
                setMessages([]);
                return;
            }

            setIsLoading(true);
            const { data, error } = await supabase
                .from('conversations')
                .select('messages')
                .eq('id', conversationId)
                .single();
            setIsLoading(false);

            if (error) {
                console.error("Erro ao buscar histórico da conversa:", error);
                alert("Não foi possível carregar as mensagens.");
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
                console.error("Erro ao salvar nova conversa:", error);
                alert("Ocorreu um erro ao criar a nova conversa.");
                return;
            }
            if (data) onConversationCreated(data.id);
        }
    };

    // ##### FUNÇÃO HANDLE SEND COMPLETAMENTE REFEITA #####
    const handleSend = async () => {
        if (!input.trim() || isLoading || isStreaming) return;

        setIsLoading(true);
        const canSend = await checkMessageLimit(session, isProUser);
        if (!canSend) {
            setIsLoading(false);
            return;
        }

        const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');

        const apiHistory = updatedMessages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        try {
            const modelToUse = conversationId ? (await supabase.from('conversations').select('model').eq('id', conversationId).single()).data.model : selectedModel;
            const personaPrompt = personas[activePersona]?.prompt;

            const model = genAI.getGenerativeModel({
                model: modelToUse === 'pro' && isProUser ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
                systemInstruction: personaPrompt,
            });

            const result = await model.generateContentStream({ contents: apiHistory });
            setIsLoading(false);
            setIsStreaming(true);

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

            const finalMessages = [...updatedMessages, { role: 'assistant', content: text, timestamp: new Date().toISOString() }];
            setMessages(finalMessages); // Garante que o estado final está correto
            
            await saveConversation(finalMessages, conversationId, modelToUse);

            if (!isProUser && (!conversationId || modelToUse === 'flash')) {
                await supabase.rpc('increment_and_update_date', { user_id_arg: session.user.id });
            }
        } catch (error) {
            console.error('Erro no handleSend:', error);
            alert('Ocorreu um erro ao enviar a sua mensagem. Por favor, tente novamente.');
            setMessages(messages); // Restaura as mensagens em caso de erro
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
        }
    };
    
    const handleStop = () => { stopStream.current = true; };
    const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
    const handleSuggestionClick = (suggestionText) => { setInput(suggestionText); };

    return (
        <div className="chat-app">
            <header className="header">
                <div className="header-content">
                    <button className="menu-button" onClick={onToggleSidebar}><Menu size={22} /></button>
                    <div className="logo-section"><Sparkles className="logo-icon" /><h1 className="logo-text">Nexus</h1></div>
                    <div className="user-section"><span>{session.user.email}</span><button className="logout-button" onClick={() => supabase.auth.signOut()}><LogOut size={18} /> Sair</button></div>
                </div>
            </header>
            
            {!conversationId && (
                <Personas activePersona={activePersona} onSelectPersona={setActivePersona} />
            )}
            
            <main className="chat-container">
                {messages.length === 0 && !isLoading ? (
                  <div className="welcome-screen">
                    {!conversationId && (
                        <div className="model-selector">
                            <button className={`model-button ${selectedModel === 'flash' ? 'active' : ''}`} onClick={() => setSelectedModel('flash')}><Zap size={18} /><span>Nexus Flash</span></button>
                            <button className={`model-button ${selectedModel === 'pro' ? 'active' : ''}`} onClick={() => setSelectedModel('pro')} disabled={!isProUser}><Gem size={18} /><span>Nexus Pro</span>{!isProUser && <span className="pro-tag">PRO</span>}</button>
                        </div>
                    )}
                    <Sparkles className="welcome-icon" />
                    <h2 className="welcome-title">Como posso ajudar hoje?</h2>
                    {!conversationId && (
                        <div className="suggestions-grid">
                            {promptSuggestions.map((suggestion, index) => (
                                <button key={index} className="suggestion-card" onClick={() => handleSuggestionClick(suggestion.text)}>
                                    {suggestion.icon}
                                    <span>{suggestion.text}</span>
                                </button>
                            ))}
                        </div>
                    )}
                  </div>
                ) : (
                  <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
                            {message.role !== 'user' && (<div className="bot-avatar"><Sparkles /></div>)}
                            <div className="message-content">
                                <ReactMarkdown components={{ code: CodeBlock }} remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message bot-message">
                            <div className="bot-avatar"><Sparkles /></div>
                            <div className="message-content loading"><Loader2 className="spinner" /></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
            </main>
            <footer className="input-area">
                <div className="input-container">
                    {isStreaming ? (
                        <button className="stop-button" onClick={handleStop}><Square size={16} />Parar Geração</button>
                    ) : (
                        <><textarea className="input-field" placeholder="Digite sua mensagem ou clique em uma sugestão..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} rows={1} disabled={isLoading} /><button className="send-button" onClick={handleSend} disabled={!input.trim() || isLoading}><Send size={20} /></button></>
                    )}
                </div>
            </footer>
        </div>
    );
}