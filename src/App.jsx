import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './lib/supabaseClient';
import { useConversation } from './hooks/useConversation'; // Import the hook
import LandingPage from './pages/LandingPage';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { ThemeProvider } from './lib/ThemeContext';
import { TutorialProvider } from './lib/TutorialContext';
import Tutorial from './components/Tutorial';
import DocumentationPage from './pages/DocumentationPage';

import ThemeToggle from './components/ThemeToggle';
import './App.css';

// Lazy imports
const Chat = React.lazy(() => import('./components/Chat'));
const Sidebar = React.lazy(() => import('./components/Sidebar'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// ProtectedRoute component
const ProtectedRoute = ({ session }) => {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// Main App component
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(err => {
      console.error('Error getting session:', err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <LoadingSpinner size="large" text="Carregando Nexus..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TutorialProvider>
          <BrowserRouter>
            <Toaster />
            <Tutorial />

            <Routes>
              <Route path="/" element={!session ? <LandingPage /> : <Navigate to="/chat" />} />
              <Route path="/login" element={!session ? <Auth /> : <Navigate to="/chat" />} />
              <Route path="/docs" element={<DocumentationPage />} />
              <Route element={<ProtectedRoute session={session} />}>
                <Route path="/chat" element={<MainAppLayout session={session} />} />
                <Route path="/chat/:id" element={<MainAppLayout session={session} />} />
                <Route path="/profile" element={<UserProfile session={session} />} />
                <Route path="/admin" element={
                  <React.Suspense fallback={<div style={{padding:20}}>Carregando...</div>}>
                    <AdminDashboard session={session} />
                  </React.Suspense>
                } />
              </Route>
            </Routes>
          </BrowserRouter>
        </TutorialProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// MainAppLayout component (now much simpler)
const MainAppLayout = React.memo(({ session }) => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  // Task 4: Persist Sidebar State
  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('isSidebarOpen');
    if (savedState !== null) {
      return JSON.parse(savedState);
    }
    // Default to closed on mobile, open on desktop
    return window.innerWidth > 768;
  });

  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();

  // Task 4: Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Use the custom hook for conversation management
  const { conversations, loadingConversations, saveConversation, deleteConversation } = useConversation(session);

  const fetchUserProfile = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    setUserProfile(data);
  }, [session]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Handle payment success
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get('payment_success') === 'true') {
        await supabase.from('profiles').update({ is_pro: true }).eq('id', session.user.id);
        toast.success("Obrigado por assinar o Nexus Pro! Bem-vindo(a) à elite. ✨");
        fetchUserProfile();
        window.history.replaceState(null, '', '/chat');
      }
    };
    checkPaymentStatus();
  }, [location, session.user.id, fetchUserProfile]);

  const handleDelete = (convoId) => {
    deleteConversation(convoId);
    if (activeConversationId === convoId) {
      setActiveConversationId(null);
    }
  }

  return (
    <div className="main-layout">
      <React.Suspense fallback={<LoadingSpinner size="small" />}>
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          conversations={conversations}
          conversationsLoading={loadingConversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onDeleteConversation={handleDelete}
          isProUser={userProfile?.is_pro}
        />
      </React.Suspense>
      <React.Suspense fallback={<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>Carregando chat...</div>}>
        <Chat 
          key={activeConversationId || 'new'}
          session={session} 
          conversationId={activeConversationId}
          saveConversation={saveConversation} // Pass save function to Chat
          onConversationCreated={setActiveConversationId} // When a new convo is created, set it as active
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          isProUser={userProfile?.is_pro}
        />
      </React.Suspense>
    </div>
  );
});

export default App;
