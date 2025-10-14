import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './lib/ThemeContext';
import { AuthProvider } from './lib/AuthContext';
// Log inicial para ajudar a depuração
console.log('main.jsx: iniciando render');

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>,
  )
} catch (err) {
  // Erros de render podem impedir que a página apareça — mostramos no console
  console.error('Erro ao montar o app (main.jsx):', err);
  // Também expomos para o window para facilitar debug remoto
  window.__APP_MOUNT_ERROR = err;
}
