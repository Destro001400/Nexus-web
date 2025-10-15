
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useConversationContext } from '../hooks/useConversationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import { exportAsTxt, exportAsMarkdown, exportAsPdf } from '../lib/exportConversation';
import { UI_TEXTS, BREAKPOINTS, STORAGE_KEYS, QUERY_PARAMS } from '../constants/appConstants';

// Lazy imports for components
const Chat = React.lazy(() => import('../components/Chat'));
const Sidebar = React.lazy(() => import('../components/Sidebar'));

const MainAppLayout = React.memo(() => {
  const { session, user } = useAuth(); // Utiliza o usuário do contexto
  const { activeConversation } = useConversationContext();
  const navigate = useNavigate();
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem(STORAGE_KEYS.SIDEBAR_OPEN);
    if (savedState !== null) {
      return JSON.parse(savedState);
    }
    return window.innerWidth > BREAKPOINTS.MOBILE;
  });

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_OPEN, JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get(QUERY_PARAMS.PAYMENT_SUCCESS) === 'true' && session?.user?.id) {
        // A lógica de atualização de perfil pode ser movida para um local mais centralizado se necessário
        await supabase.from('profiles').update({ is_pro: true }).eq('id', session.user.id);
        toast.success(UI_TEXTS.PRO_UPGRADE_SUCCESS);
        // Idealmente, o contexto de autenticação se atualizaria sozinho.
        // Se não, uma função de atualização de usuário no contexto seria útil.
        window.history.replaceState(null, '', '/chat');
      }
    };
    checkPaymentStatus();
  }, [location, session?.user?.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/', { replace: true });
    toast.success(UI_TEXTS.SIGN_OUT_SUCCESS);
  };

  const handleExport = () => {
    if (!activeConversation?.messages?.length) return toast(UI_TEXTS.NOTHING_TO_EXPORT);
    const option = window.prompt('Exportar como: 1) TXT  2) Markdown  3) PDF', '1');
    if (option === '1') exportAsTxt(activeConversation.messages);
    else if (option === '2') exportAsMarkdown(activeConversation.messages);
    else if (option === '3') exportAsPdf(activeConversation.messages);
    else toast(UI_TEXTS.EXPORT_CANCELED);
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
       <Header 
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeConversation={activeConversation}
        exportConversation={handleExport}
        handleSignOut={handleSignOut}
      />
      <div className="main-layout">
        <React.Suspense fallback={<LoadingSpinner size="small" />}>
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            isProUser={user?.is_pro}
          />
        </React.Suspense>
        <main className="content-area">
          <React.Suspense fallback={<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>{UI_TEXTS.LOADING}</div>}>
            <Chat 
              key={activeConversationId || 'new'}
              conversationId={activeConversationId}
              onConversationCreated={setActiveConversationId}
              isProUser={user?.is_pro}
            />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
});

export default MainAppLayout;
