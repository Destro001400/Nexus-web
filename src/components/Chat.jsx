import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, LogOut, Menu, Copy, Check, Square, Zap, Gem } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Chat.css';
import { categorizeConversation } from '../lib/categorizer.js';
import { checkMessageLimit } from '../lib/limit.js';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const models = {
  flash: genAI.getGenerativeModel({ model: "gemini-2.5-flash" }),
  pro: genAI.getGenerativeModel({ model: "gemini-2.5-pro" }),
};

const generateTitle = async (messages) => {
    const context = messages.slice(0, 2).map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const prompt = `Analise a conversa a seguir e crie um título curto e objetivo para ela com no máximo 5 palavras. Responda APENAS com o título.`;
    try {
        const result = await models.flash.generateContent(prompt + `\n\nCONVERSA:\n---\n${context}\n---`);
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
    const [chat, setChat] = useState(null);
    const [selectedModel, setSelectedModel] = useState('flash');
    const [conversationModel, setConversationModel] = useState('flash');
    const messagesEndRef = useRef(null);
    const stopStream = useRef(false);

    useEffect(() => {
        const setupChat = async () => {
            setMessages([]);
            let initialMessages = [];
            let modelForConversation = 'flash';

            if (conversationId) {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('conversations')
                    .select('messages, model')
                    .eq('id', conversationId)
                    .single();

                setIsLoading(false);

                if (error) {
                    console.error("Erro ao buscar histórico da conversa:", error);
                    alert("Não foi possível carregar as mensagens. Verifique o console para mais detalhes.");
                    const emptyChat = models.flash.startChat({ history: [] });
                    setChat(emptyChat);
                    return;
                }

                if (data) {
                    initialMessages = data.messages || [];
                    modelForConversation = data.model || 'flash';
                }
            }
            
            setMessages(initialMessages);
            setConversationModel(modelForConversation);
            const activeModel = models[modelForConversation] || models.flash;
            const newChat = activeModel.startChat({ 
                history: initialMessages.map(msg => ({ 
                    role: msg.role === 'user' ? 'user' : 'model', 
                    parts: [{ text: msg.content }] 
                })) 
            });
            setChat(newChat);
        };

        setupChat();
    }, [conversationId]);


    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages]);

    const saveConversation = async (updatedMessages, currentConvoId, modelToSave) => {
        let dataToSave = { messages: updatedMessages, updated_at: new Date() };
        
        if (currentConvoId) {
            await supabase.from('conversations').update(dataToSave).eq('id', currentConvoId);
        } else {
            dataToSave.model = modelToSave;
            const title = await generateTitle(updatedMessages);
            dataToSave.title = title;

            // ##### CÓDIGO CORRIGIDO ABAIXO #####
            // A API do Supabase espera um array para a inserção de dados.
            // Envolvemos o nosso objeto num array [ ... ] para corrigir o erro 400.
            const { data, error } = await supabase
                .from('conversations')
                .insert([{ ...dataToSave, user_id: session.user.id }])
                .select('id')
                .single();
            
            // Se a inserção falhar, mostramos um erro.
            if (error) {
                console.error("Erro ao salvar nova conversa:", error);
                alert("Ocorreu um erro ao criar a nova conversa.");
                return;
            }
            // ##### FIM DO CÓDIGO CORRIGIDO #####

            if (data) onConversationCreated(data.id);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading || isStreaming || !chat) return;

        setIsLoading(true);
        const canSend = await checkMessageLimit(session, isProUser);
        if (!canSend) {
            setIsLoading(false);
            return;
        }

        const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setInput('');

        try {
            stopStream.current = false;
            const result = await chat.sendMessageStream(input);
            setIsLoading(false);
            setIsStreaming(true);
            let text = '';
            setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date().toISOString() }]);
            for await (const chunk of result.stream) {
                if (stopStream.current) break;
                text += chunk.text();
                setMessages(prev => {
                    const newMessages = [...prev];
                    if(newMessages.length) newMessages[newMessages.length - 1].content = text;
                    return newMessages;
                });
            }

            const finalMessages = [...currentMessages, { role: 'assistant', content: text, timestamp: new Date().toISOString() }];
            const modelToUse = conversationId ? conversationModel : selectedModel;

            await saveConversation(finalMessages, conversationId, modelToUse);

            if (!isProUser || (isProUser && modelToUse === 'flash')) {
                await supabase.rpc('increment_and_update_date', { user_id_arg: session.user.id });
            }

        } catch (error) {
             console.error('Erro no handleSend:', error);
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
        }
    };

    const handleStop = () => { stopStream.current = true; };
    const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

    return (
        <div className="chat-app">
            <header className="header">
                <div className="header-content">
                    <button className="menu-button" onClick={onToggleSidebar}><Menu size={22} /></button>
                    <div className="logo-section"><Sparkles className="logo-icon" /><h1 className="logo-text">Nexus</h1></div>
                    <div className="user-section"><span>{session.user.email}</span><button className="logout-button" onClick={() => supabase.auth.signOut()}><LogOut size={18} /> Sair</button></div>
                </div>
            </header>
            <main className="chat-container">
                {!conversationId && messages.length === 0 && (
                    <div className="model-selector-wrapper">
                        <div className="model-selector">
                            <button className={`model-button ${selectedModel === 'flash' ? 'active' : ''}`} onClick={() => setSelectedModel('flash')}><Zap size={18} /><span>Nexus Flash</span></button>
                            <button className={`model-button ${selectedModel === 'pro' ? 'active' : ''}`} onClick={() => setSelectedModel('pro')} disabled={!isProUser}><Gem size={18} /><span>Nexus Pro</span>{!isProUser && <span className="pro-tag">PRO</span>}</button>
                        </div>
                    </div>
                )}
                {messages.length === 0 && !isLoading ? (
                  <div className="welcome-screen">
                    <Sparkles className="welcome-icon" /><h2 className="welcome-title">Bem-vindo ao Nexus</h2><p className="welcome-text">Inicie uma nova conversa ou selecione uma no histórico.</p>
                  </div>
                ) : (
                  <div className="messages">
                    {messages.map((message, index) => (<div key={index} className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}><div className="message-content"><ReactMarkdown components={{ code: CodeBlock }} remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown></div></div>))}
                    {isLoading && (<div className="message bot-message"><div className="message-content loading"><Loader2 className="spinner" /></div></div>)}
                    <div ref={messagesEndRef} />
                  </div>
                )}
            </main>
            <footer className="input-area">
                <div className="input-container">
                    {isStreaming ? (
                        <button className="stop-button" onClick={handleStop}><Square size={16} />Parar Geração</button>
                    ) : (
                        <><textarea className="input-field" placeholder="Digite sua mensagem..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} rows={1} disabled={isLoading} /><button className="send-button" onClick={handleSend} disabled={!input.trim() || isLoading}><Send size={20} /></button></>
                    )}
                </div>
            </footer>
        </div>
    );
}