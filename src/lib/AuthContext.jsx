import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Verificação inicial da sessão
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(`Erro ao buscar sessão: ${sessionError.message}`);
        }

        setSession(initialSession);

        if (initialSession) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', initialSession.user.id)
            .single();

          if (profileError) {
            throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
          }
          setUser(profile);
        }
      } catch (err) {
        console.error("Falha na configuração de autenticação:", err);
        toast.error(err.message || "Ocorreu um erro inesperado.");
        // Garante que o usuário seja desconectado se algo der errado
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    // Listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setLoading(true); // Mostra o spinner durante a transição
      if (event === 'SIGNED_IN' && newSession) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newSession.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil no login:", error);
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          toast.error("Erro ao verificar seu perfil. Tente novamente.");
        } else if (profile && !profile.is_active) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          toast.error("Sua conta foi desativada.", { duration: 5000 });
        } else {
          setSession(newSession);
          setUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      } else if (event === 'USER_UPDATED') {
        // Atualiza o perfil se os dados do usuário mudarem
        const { data: updatedProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newSession.user.id)
          .single();
        
        if (!error) {
          setUser(updatedProfile);
        }
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // O spinner de carregamento agora é exibido condicionalmente
  if (loading) {
    return (
      <div className="loading-screen">
        <LoadingSpinner size="large" text="Carregando Nexus..." />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};