import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Zap, MailCheck } from 'lucide-react'
import './Auth.css'

// Ícone do Google para o botão
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.1v2.9h5.2c-.3 1.8-1.5 3.3-3.3 4.3v2.4h3.1c1.8-1.7 2.9-4.2 2.9-6.9c0-.6-.1-1.2-.2-1.7z"/><path fill="currentColor" d="M12.25 22c2.4 0 4.5-.8 6-2.2l-3.1-2.4c-.8.5-1.9.9-3 .9c-2.3 0-4.2-1.5-4.9-3.6H4.1v2.4c1.5 2.9 4.6 5 8.15 5z"/><path fill="currentColor" d="M7.35 14.1c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6V8.5H4.1C2.9 10.9 2.9 13.9 4.1 16.3l3.25-2.2z"/><path fill="currentColor" d="M12.25 6.2c1.3 0 2.5.5 3.4 1.4l2.7-2.7C16.7 3.3 14.6 2 12.25 2C8.75 2 5.65 4.1 4.1 7l3.25 2.4C8.05 7.8 9.95 6.2 12.25 6.2z"/></svg>
);

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupSubmitted, setSignupSubmitted] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.error_description || error.message);
    setLoading(false);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      setSignupSubmitted(true);
    }
    setLoading(false);
  };

  // Função para o login com Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      alert('Erro no login com Google: ' + error.message);
      setLoading(false);
    }
  };

  if (signupSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-card confirmation">
          <div className="auth-header">
            <MailCheck className="auth-logo-icon" />
            <h1 className="auth-title">Verifique seu E-mail</h1>
            <p className="auth-subtitle confirmation-text">
              Enviamos um link de confirmação para <strong>{email}</strong>.
              <br /><br />
              Clique no link para ativar sua conta e depois retorne para fazer o login.
            </p>
            <div className="button-group">
                <button onClick={() => setSignupSubmitted(false)} className="auth-button primary">
                  Voltar para o Login
                </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Zap className="auth-logo-icon" />
          <h1 className="auth-title">Bem-vindo ao Nexus</h1>
          <p className="auth-subtitle">Faça login ou crie sua conta para começar</p>
        </div>

        <div className="button-group social">
          <button onClick={handleGoogleLogin} className="auth-button social-google" disabled={loading}>
            <GoogleIcon />
            Continuar com Google
          </button>
        </div>

        <div className="divider">ou</div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" className="auth-input" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input id="password" className="auth-input" type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="button-group">
            <button type="submit" className="auth-button primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button onClick={handleSignUp} className="auth-button secondary" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}