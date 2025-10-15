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
            console.warn(`Perfil não encontrado para o usuário ${initialSession.user.id}. Tratando como ativo por padrão.`);
            setUser(null); // O app deve ser capaz de lidar com um perfil nulo
          } else {
            setUser(profile);
          }
        }
      } catch (err) {
        console.error("Falha crítica na configuração de autenticação:", err);
        toast.error("Falha ao iniciar a autenticação. Tente recarregar a página.");
      } finally {
        setLoading(false); // Garante que o carregamento termine mesmo em caso de erro
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setLoading(true);

      if (event === 'SIGNED_IN' && newSession) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newSession.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil no login. Tratando como ativo por padrão:", error);
          setUser(null); // A sessão é válida, mas o perfil não foi carregado
        } else if (profile && !profile.is_active) {
          toast.error("Sua conta foi desativada.", { duration: 5000 });
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setLoading(false);
          return; // Interrompe a execução para evitar estados inconsistentes
        } else {
          setUser(profile);
        }
        setSession(newSession);

      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      } else if (event === 'USER_UPDATED' && newSession) {
        const { data: updatedProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newSession.user.id)
          .single();
        
        if (error) {
          console.error("Erro ao atualizar o perfil do usuário:", error);
        } else {
          setUser(updatedProfile);
        }
        setSession(newSession); // Garante que a sessão seja atualizada
      } else {
        // Para outros eventos, apenas atualiza a sessão se ela existir
        setSession(newSession);
      }
      
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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