import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import LandingPage from './pages/LandingPage';
import Auth from './components/Auth';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import './App.css';

// Componente para rotas que precisam de login
const ProtectedRoute = ({ session }) => {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-screen">Carregando Nexus...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!session ? <LandingPage /> : <Navigate to="/chat" />} />
        <Route path="/login" element={!session ? <Auth /> : <Navigate to="/chat" />} />
        <Route element={<ProtectedRoute session={session} />}>
          <Route path="/chat" element={<MainAppLayout session={session} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Componente que agrupa a lógica do app logado
const MainAppLayout = ({ session }) => {
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const location = useLocation();

    // Função para buscar o perfil (agora separada)
    const fetchUserProfile = useCallback(async () => {
        if (!session) return;
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setUserProfile(data);
    }, [session]);
    
    // useEffect que ouve as mudanças do banco de dados em tempo real
    useEffect(() => {
        if (!session) return;

        // 1. Busca os dados iniciais (perfil e conversas)
        const fetchInitialData = async () => {
            fetchUserProfile();
            const { data } = await supabase
                .from('conversations')
                .select('id, created_at, title, category, model')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });
            if (data) setConversations(data);
        };
        fetchInitialData();

        // 2. "Ouve" por qualquer mudança na tabela de conversas
        const channel = supabase
            .channel('public:conversations')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `user_id=eq.${session.user.id}` },
                (payload) => {
                    console.log('Mudança no histórico recebida!', payload);
                    // Quando algo muda (cria, atualiza, deleta), busca a lista de novo
                    fetchInitialData();
                }
            )
            .subscribe();

        // 3. Limpa a "audição" quando o componente desmonta
        return () => {
            supabase.removeChannel(channel);
        };
    }, [session, fetchUserProfile]);


    // useEffect que verifica o status do pagamento
    useEffect(() => {
      const checkPaymentStatus = async () => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('payment_success') === 'true') {
          await supabase.from('profiles').update({ is_pro: true }).eq('id', session.user.id);
          alert("Obrigado por assinar o Nexus Pro! Bem-vindo(a) à elite. ✨");
          fetchUserProfile(); // Atualiza o perfil depois do pagamento
          window.history.replaceState(null, '', '/chat');
        }
      };
      checkPaymentStatus();
    }, [location, session.user.id, fetchUserProfile]);


    const handleDeleteConversation = async (conversationId) => {
        if (!window.confirm("Tem certeza que quer apagar esta conversa?")) return;
        
        await supabase.from('conversations').delete().eq('id', conversationId);

        // Se a conversa deletada era a ativa, volta para a tela de nova conversa
        if (activeConversationId === conversationId) {
            setActiveConversationId(null);
        }
        // Não precisa mais chamar fetchConversations(), o Realtime cuida disso!
    };

    return (
        <div className="main-layout">
            <Sidebar 
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={setActiveConversationId}
                onDeleteConversation={handleDeleteConversation}
                isProUser={userProfile?.is_pro}
            />
            <Chat 
                key={activeConversationId || 'new'}
                session={session} 
                conversationId={activeConversationId}
                onConversationCreated={(newId) => {
                    // Quando uma nova conversa é criada, o Realtime vai atualizar a lista.
                    // A gente só precisa definir a nova conversa como ativa.
                    setActiveConversationId(newId);
                }}
                onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                isProUser={userProfile?.is_pro}
            />
        </div>
    );
}

export default App;