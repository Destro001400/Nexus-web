import React from 'react';
import { Send, Square } from 'lucide-react';
import './ChatInput.css';

const ChatInput = ({
  input,
  setInput,
  handleSend,
  handleKeyPress,
  isStreaming,
  handleStop,
  isLoading,
}) => {
  return (
    <footer className="input-area">
      <div className="input-container">
        {isStreaming ? (
          <button className="stop-button" onClick={handleStop}>
            <Square size={16} />
            Parar Geração
          </button>
        ) : (
          <>
            <textarea
              className="input-field"
              placeholder="Digite sua mensagem ou clique em uma sugestão..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send size={20} />
            </button>
          </>
        )}
      </div>
    </footer>
  );
};

export default ChatInput;
