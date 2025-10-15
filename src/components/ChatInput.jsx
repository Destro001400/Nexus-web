import React, { useEffect, useRef } from 'react';
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
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <footer className="chat-input">
      <div className="input-container">
        {isStreaming ? (
          <button className="button-base stop-button" onClick={handleStop}>
            <Square size={16} />
            Parar Geração
          </button>
        ) : (
          <>
            <textarea
              ref={textareaRef}
              className="input-field"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label="Enviar mensagem"
            >
              <Send size={18} />
            </button>
          </>
        )}
      </div>
    </footer>
  );
};

export default ChatInput;
