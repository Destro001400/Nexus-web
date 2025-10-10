import { Bot, Code, Music, FileText, Search, Milestone, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logo from '../assets/logo.png';
import { landingContent } from '../lib/landing-content';

// Map string names to actual components
const iconMap = {
  Search: <Search size={24} />,
  FileText: <FileText size={24} />,
  Music: <Music size={24} />,
};

export default function LandingPage() {
  const { hero, whatIsNexus, features, roadmap, support, footer } = landingContent;

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="landing-logo">
          <img src={logo} alt="Nexus Logo" className="logo-image" />
        </div>
        <nav className="landing-nav">
          <Link to="/chat" className="primary">Entrar</Link>
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {hero.title.split('.')[0]}. <span className="highlight">{hero.title.split('.')[1]}.</span>
          </h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
          <Link to="/chat" className="button-base button-primary" style={{padding: '1rem 2rem', fontSize: '1.1rem'}}>{hero.button}</Link>
        </div>
        <div className="hero-visual">
          <Bot size={200} className="hero-icon" />
        </div>
      </main>

      <section id="about" className="landing-section">
        <h2>{whatIsNexus.title}</h2>
        {whatIsNexus.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </section>

      <section id="features" className="landing-section">
        <h2>{features.title}</h2>
        <div className="features-grid">
          {features.cards.map((card, i) => (
            <div className="feature-card" key={i}>
              {iconMap[card.icon]}
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <ul>
                {card.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="roadmap" className="landing-section">
        <h2>{roadmap.title}</h2>
        <p>{roadmap.description}</p>
        <div className="roadmap-acts">
          {roadmap.acts.map((act, i) => (
            <div className="roadmap-act" key={i}>
              <Milestone size={24} />
              <div>
                <h3>{act.title}</h3>
                <p>{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="support" className="landing-section">
        <Heart size={32} />
        <h2>{support.title}</h2>
        {support.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        <a href="https://apoia.se/nexusia" target="_blank" rel="noopener noreferrer" className="button-base button-primary" style={{backgroundColor: 'var(--color-accent)', marginTop: '2rem', padding: '1rem 2rem', fontSize: '1.1rem'}}>{support.button}</a>
      </section>

      <footer className="landing-footer">
        <p>{footer.text}</p>
      </footer>
    </div>
  );
}
