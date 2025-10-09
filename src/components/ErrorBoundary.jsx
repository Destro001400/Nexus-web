import React from 'react';
import { toast } from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    toast.error('Ops! Algo deu errado. Por favor, tente novamente.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Desculpe, algo deu errado</h2>
          <p>Tente recarregar a página. Se o problema persistir, entre em contato com o suporte.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;