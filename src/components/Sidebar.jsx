import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, X, Search, Star, Crown, Loader, User, Moon, Sun } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import CategoryIcon from './CategoryIcon';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose, conversations, conversationsLoading, activeConversationId, onSelectConversation, onDeleteConversation, isProUser }) {
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef();
    const [loadingUpgrade, setLoadingUpgrade] = useState(false);

    const filteredConversations = useMemo(() => {
        if (!conversations) return [];
        if (!searchTerm) return conversations;
        return conversations.filter(convo => (convo.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
    }, [conversations, searchTerm]);

    const handleDelete = (e, conversationId) => {
        e.stopPropagation();
        if (window.confirm("Tem a certeza de que quer apagar esta conversa?")) {
            onDeleteConversation(conversationId);
        }
    };

    const handleUpgrade = async () => {
        setLoadingUpgrade(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session || !session.user) throw new Error("Você não está logado.");
            
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                method: 'POST',
                body: { email: session.user.email } 
            });

            if (error) {
                const errorMessage = await error.context.json();
                console.error("Erro da função Supabase:", errorMessage);
                throw new Error(errorMessage.error || "Não foi possível iniciar o checkout.");
            }
            
            window.location.href = data.url;
        } catch (error) {
            toast.error("Erro ao criar a sessão de pagamento: " + error.message);
        } finally {
            setLoadingUpgrade(false);
        }
    };

    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.ctrlKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                onSelectConversation(null);
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                navigate('/profile');
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, onSelectConversation]);

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
                <div className="sidebar-header">
                    <button className="button-base button-primary new-chat-button" onClick={() => onSelectConversation(null)}><Plus size={18} /> Nova Conversa</button>
                    <button className="close-sidebar-button" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="search-bar">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar... (Ctrl+K)"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        ref={searchInputRef}
                    />
                </div>
                <nav className="conversation-history">
                    <p className="history-title">Histórico</p>
                    {conversationsLoading ? (
                        <div className="loading-text"><Loader className="loading-icon" size={16} /> Carregando...</div>
                    ) : (
                        <ul>
                            {filteredConversations.length === 0 ? (
                                <li className="empty-state">Comece uma nova conversa para ver seu histórico.</li>
                            ) : (
                                filteredConversations.map((convo) => (
                                    <li key={convo.id}>
                                        <a href="#" className={`conversation-link ${convo.id === activeConversationId ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onSelectConversation(convo.id); }}>
                                            <CategoryIcon category={convo.category} className="category-icon" size={16} />
                                            <span>{convo.title || `Conversa de ${new Date(convo.created_at).toLocaleDateString()}`}</span>
                                            <button className="delete-button" onClick={(e) => handleDelete(e, convo.id)}><Trash2 size={14} /></button>
                                        </a>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </nav>
            </div>
            <div className="sidebar-footer">
                <div className="footer-actions">
                    <button className="profile-button" onClick={() => navigate('/profile')}>
                        <User size={16} /> Meu Perfil
                    </button>
                    <button className="theme-toggle-button" onClick={toggleTheme} title="Alternar tema">
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>
                {isProUser ? (
                    <div className="pro-badge">
                        <Crown size={16} />
                        <span>Nexus Pro Ativo</span>
                    </div>
                ) : (
                    <button className="button-base button-primary upgrade-button" onClick={handleUpgrade} disabled={loadingUpgrade}>
                        <Star size={16} />
                        {loadingUpgrade ? "Aguarde..." : "Upgrade para o Pro"}
                    </button>
                )}
            </div>
        </aside>
    );
}