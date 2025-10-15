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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      setSession(session);

      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil. O usuário será tratado como ativo, mas sem dados de perfil:", error);
          setUser(null);
        } else if (profile && !profile.is_active) {
          toast.error("Sua conta foi desativada.", { duration: 5000 });
          await supabase.auth.signOut();
          // onAuthStateChange será acionado novamente com SIGNED_OUT
        } else {
          setUser(profile);
        }
      } else {
        setUser(null);
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
