import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext';
import { useConversationContext } from '../hooks/useConversationContext';
import { Plus, Trash2, X, Search, Star, Crown, Loader, User, Moon, Sun, FileText, HelpCircle } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import ThemeToggle from './ThemeToggle';
import ConfirmationModal from './ConfirmationModal';
import { UI_TEXTS } from '../constants/appConstants';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose, activeConversationId, onSelectConversation, isProUser }) {
    const { conversations, loadingConversations, deleteConversation } = useConversationContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState(null);
    const searchInputRef = useRef();

    const filteredConversations = useMemo(() => {
        if (!conversations) return [];
        if (!searchTerm) return conversations;
        return conversations.filter(convo => (convo.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
    }, [conversations, searchTerm]);

    const handleDeleteClick = (e, conversationId) => {
        e.stopPropagation();
        setConversationToDelete(conversationId);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (conversationToDelete) {
            deleteConversation(conversationToDelete);
            // If the active conversation is the one being deleted, notify the parent to reset it.
            if (activeConversationId === conversationToDelete) {
                onSelectConversation(null);
            }
            setConversationToDelete(null);
        }
        setIsModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setConversationToDelete(null);
    };

    const handleUpgrade = () => {
        window.open('https://apoia.se/nexusia', '_blank');
    };

    const navigate = useNavigate();
    const { theme } = useTheme();

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
        <>
            {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}
            <aside className={`sidebar ${isOpen ? 'open' : 'closed'} ${theme}`}>
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <button className="button-base button-primary new-chat-button" onClick={() => onSelectConversation(null)}><Plus size={18} /> {UI_TEXTS.NEW_CHAT}</button>
                        <button className="close-sidebar-button" onClick={onClose}><X size={20} /></button>
                    </div>
                    <div className="search-bar">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder={UI_TEXTS.SEARCH_PLACEHOLDER}
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            ref={searchInputRef}
                        />
                    </div>
                    <nav className="conversation-history">
                        <p className="history-title">Histórico</p>
                        {loadingConversations ? (
                            <div className="loading-text"><Loader className="loading-icon" size={16} /> {UI_TEXTS.LOADING}</div>
                        ) : (
                            <ul>
                                {filteredConversations.length === 0 ? (
                                    <li className="empty-state">{UI_TEXTS.EMPTY_HISTORY}</li>
                                ) : (
                                    filteredConversations.map((convo) => (
                                        <li key={convo.id}>
                                            <a href="#" className={`conversation-link ${convo.id === activeConversationId ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onSelectConversation(convo.id); }}>
                                                <CategoryIcon category={convo.category} className="category-icon" size={16} />
                                                <span>{convo.title || `Conversa de ${new Date(convo.created_at).toLocaleDateString()}`}</span>
                                                <button className="delete-button" onClick={(e) => handleDeleteClick(e, convo.id)}><Trash2 size={14} /></button>
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
                        <ThemeToggle />
                    </div>

                    <div className="help-links">
                        <a href="/docs" target="_blank" rel="noopener noreferrer" className="conversation-link">
                            <FileText size={16} className="category-icon" />
                            <span>Documentação</span>
                        </a>
                        <a href="mailto:Nexus.ai.corporation@gmail.com" className="conversation-link">
                            <HelpCircle size={16} className="category-icon" />
                            <span>Suporte</span>
                        </a>
                    </div>

                    {isProUser ? (
                        <div className="pro-badge">
                            <Crown size={16} />
                            <span>Nexus Pro Ativo</span>
                        </div>
                    ) : (
                        <button className="button-base button-primary upgrade-button" onClick={handleUpgrade}>
                            <Star size={16} />
                            {UI_TEXTS.UPGRADE_TO_PRO}
                        </button>
                    )}
                </div>
            </aside>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
                title={UI_TEXTS.DELETE_CONFIRM_TITLE}
                message={UI_TEXTS.DELETE_CONFIRM_MESSAGE}
            />
        </>
    );
}