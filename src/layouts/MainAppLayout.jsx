
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';
import { useConversationContext } from '../lib/ConversationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import { exportAsTxt, exportAsMarkdown, exportAsPdf } from '../lib/exportConversation';
import { UI_TEXTS, BREAKPOINTS, STORAGE_KEYS, QUERY_PARAMS } from '../constants/appConstants';

// Lazy imports for components
const Chat = React.lazy(() => import('../components/Chat'));
const Sidebar = React.lazy(() => import('../components/Sidebar'));

const MainAppLayout = React.memo(() => {
  const { session } = useAuth();
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

  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_OPEN, JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const fetchUserProfile = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    setUserProfile(data);
  }, [session]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get(QUERY_PARAMS.PAYMENT_SUCCESS) === 'true') {
        await supabase.from('profiles').update({ is_pro: true }).eq('id', session.user.id);
        toast.success(UI_TEXTS.PRO_UPGRADE_SUCCESS);
        fetchUserProfile();
        window.history.replaceState(null, '', '/chat');
      }
    };
    if (session?.user?.id) {
      checkPaymentStatus();
    }
  }, [location, session?.user?.id, fetchUserProfile]);

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
            isProUser={userProfile?.is_pro}
          />
        </React.Suspense>
        <main className="content-area">
          <React.Suspense fallback={<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>{UI_TEXTS.LOADING}</div>}>
            <Chat 
              key={activeConversationId || 'new'}
              conversationId={activeConversationId}
              onConversationCreated={setActiveConversationId}
              isProUser={userProfile?.is_pro}
            />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
});

export default MainAppLayout;
