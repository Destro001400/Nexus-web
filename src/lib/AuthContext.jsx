import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'SIGNED_IN' && session) {
        // User has just signed in, check their active status
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_active')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile on login:", error);
          // Log them out just in case something is wrong
          await supabase.auth.signOut();
          setSession(null);
          toast.error("Erro ao verificar seu perfil. Tente novamente.");
        } else if (profile && !profile.is_active) {
          // User is blocked, sign them out immediately
          await supabase.auth.signOut();
          setSession(null);
          toast.error("Sua conta foi desativada por um administrador.", { duration: 6000 });
        } else {
          // User is active, allow the session
          setSession(session);
        }
      } else if (_event === 'SIGNED_OUT') {
        // User signed out
        setSession(null);
      } else {
        // For other events, just update the session
        setSession(session);
      }
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
    <AuthContext.Provider value={{ session, loading }}>
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