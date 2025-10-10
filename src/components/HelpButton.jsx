import React, { useState } from 'react';
import { useTutorial } from '../lib/TutorialContext';
import './HelpButton.css';

export default function HelpButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { startTutorial, hasSeenTutorial } = useTutorial();

  const handleStartTutorial = () => {
    setIsMenuOpen(false);
    startTutorial();
  };

  return (
    <div className="help-button-container">
      <button
        className="help-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Ajuda"
      >
        <i className="fas fa-question"></i>
      </button>
      
      {isMenuOpen && (
        <div className="help-menu">
          <div 
            className="help-menu-item"
            onClick={handleStartTutorial}
          >
            <i className="fas fa-play-circle"></i>
            {hasSeenTutorial ? 'Reiniciar Tutorial' : 'Iniciar Tutorial'}
          </div>
          <a 
            href="/docs" 
            className="help-menu-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-book"></i>
            Documentação
          </a>
          <a 
            href="mailto:suporte@nexus.com" 
            className="help-menu-item"
          >
            <i className="fas fa-envelope"></i>
            Contato Suporte
          </a>
        </div>
      )}
    </div>
  );
}