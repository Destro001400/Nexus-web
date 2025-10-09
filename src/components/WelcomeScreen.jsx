import React from 'react';
import { Sparkles, Zap, Gem } from 'lucide-react';
import './WelcomeScreen.css';

const WelcomeScreen = ({
  conversationId,
  selectedModel,
  setSelectedModel,
  isProUser,
  promptSuggestions,
  handleSuggestionClick,
}) => {
  return (
    <div className="welcome-screen">
      {!conversationId && (
        <div className="model-selector">
          <button
            className={`model-button ${selectedModel === 'flash' ? 'active' : ''}`}
            onClick={() => setSelectedModel('flash')}
          >
            <Zap size={18} />
            <span>Nexus Flash</span>
          </button>
          <button
            className={`model-button ${selectedModel === 'pro' ? 'active' : ''}`}
            onClick={() => setSelectedModel('pro')}
            disabled={!isProUser}
          >
            <Gem size={18} />
            <span>Nexus Pro</span>
            {!isProUser && <span className="pro-tag">PRO</span>}
          </button>
        </div>
      )}
      <Sparkles className="welcome-icon" />
      <h2 className="welcome-title">Como posso ajudar hoje?</h2>
      {!conversationId && (
        <div className="suggestions-grid">
          {promptSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-card"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              {suggestion.icon}
              <span>{suggestion.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
