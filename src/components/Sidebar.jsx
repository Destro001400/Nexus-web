import { useState, useMemo } from 'react';
import { Plus, MessageSquare, Trash2, X, Search, Star, Crown } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose, conversations, activeConversationId, onSelectConversation, onDeleteConversation, isProUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);

  const filteredConversations = useMemo(() => {
      if (!conversations) return [];
      if (!searchTerm) return conversations;
      return conversations.filter(convo => (convo.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [conversations, searchTerm]);

  const handleDelete = (e, conversationId) => {
      e.stopPropagation();
      onDeleteConversation(conversationId);
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
          if (error) throw error;
          window.location.href = data.url;
      } catch (error) {
          alert("Erro: " + error.message);
      } finally {
          setLoadingUpgrade(false);
      }
  };

  return (
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
          <div>
              <div className="sidebar-header">
                  <button className="new-chat-button" onClick={() => onSelectConversation(null)}><Plus size={18} /> Nova Conversa</button>
                  <button className="close-sidebar-button" onClick={onClose}><X size={20} /></button>
              </div>
              <div className="search-bar">
                  <Search className="search-icon" size={18} />
                  <input type="text" placeholder="Pesquisar..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <nav className="conversation-history">
                  <p className="history-title">Histórico</p>
                  <ul>
                      {filteredConversations.map((convo) => (
                          <li key={convo.id}>
                              <a href="#" className={`conversation-link ${convo.id === activeConversationId ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onSelectConversation(convo.id); }}>
                                  <MessageSquare size={16} />
                                  <span>{convo.title || `Conversa de ${new Date(convo.created_at).toLocaleDateString()}`}</span>
                                  <button className="delete-button" onClick={(e) => handleDelete(e, convo.id)}><Trash2 size={14} /></button>
                              </a>
                          </li>
                      ))}
                  </ul>
              </nav>
          </div>
          <div className="sidebar-footer">
              {isProUser ? (
                  <div className="pro-badge">
                      <Crown size={16} />
                      <span>Nexus Pro Ativo</span>
                  </div>
              ) : (
                  <button className="upgrade-button" onClick={handleUpgrade} disabled={loadingUpgrade}>
                      <Star size={16} />
                      {loadingUpgrade ? "Aguarde..." : "Upgrade para o Pro"}
                  </button>
              )}
          </div>
      </aside>
  );
}