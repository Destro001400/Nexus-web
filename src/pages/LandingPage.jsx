import { Sparkles, Bot, Code, Music, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="landing-logo">
          <Sparkles className="logo-icon" />
          <h1>Nexus</h1>
        </div>
        <nav className="landing-nav">
          <Link to="/app" className="landing-button primary">Entrar</Link>
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            O LLM definitivo para <span className="highlight">pesquisa, criação</span> e <span className="highlight">exploração criativa</span>.
          </h1>
          <p className="hero-subtitle">
            Nexus é um modelo de linguagem grande pensado para ser útil tanto pra quem pesquisa quanto pra quem cria, com foco em música, conteúdo e suporte técnico.
          </p>
          <Link to="/app" className="landing-button large primary">Comece a usar gratuitamente</Link>
        </div>
        <div className="hero-visual">
          <Bot size={150} className="hero-icon" />
        </div>
      </main>

      <section className="features-section">
        <h2>Funcionalidades Principais</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FileText />
            <h3>Pesquisa Acadêmica</h3>
            <p>Síntese e análise crítica de artigos, geração de hipóteses e resumos científicos.</p>
          </div>
          <div className="feature-card">
            <Music />
            <h3>Criação Musical</h3>
            <p>Assistência para composição de letras, estruturas e ideias de arranjos musicais.</p>
          </div>
          <div className="feature-card">
            <Code />
            <h3>Suporte Técnico</h3>
            <p>Debugging, explicações de código em várias linguagens e tutoriais passo a passo.</p>
          </div>
        </div>
      </section>
    </div>
  );
}