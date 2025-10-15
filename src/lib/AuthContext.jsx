import React, { createContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Começa como true na montagem inicial

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          setUser(null);
        } else {
          setUser(profile);
        }
      }
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Atualiza o perfil do usuário quando o estado da autenticação muda (login/logout)
      if (session) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error("Erro ao buscar perfil após mudança de estado:", error);
              setUser(null);
            } else {
              setUser(profile);
            }
          });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // O AuthProvider não deve renderizar um spinner de carregamento em tela cheia,
  // pois isso impede que o resto do aplicativo seja renderizado.
  // A lógica de carregamento agora é tratada dentro dos componentes que precisam dela (ex: ProtectedRoute).
  // if (loading) {
  //   return (
  //     <div className="loading-screen">
  //       <LoadingSpinner size="large" text="Carregando Nexus..." />
  //     </div>
  //   );
  // }

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
