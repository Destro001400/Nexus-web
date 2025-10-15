import React, { useEffect, useRef } from 'react';
import { Send, Square, Paperclip, XCircle } from 'lucide-react';
import './ChatInput.css';

const ChatInput = ({
  input,
  setInput,
  image,
  setImage,
  handleSend,
  handleKeyPress,
  isStreaming,
  handleStop,
  isLoading,
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  };

  const handlePaste = (e) => {
    const file = e.clipboardData.files[0];
    if (file && file.type.startsWith('image/')) {
      e.preventDefault();
      setImage(file);
    }
  };

  return (
    <footer className="chat-input">
      {image && (
        <div className="image-preview">
          <img src={URL.createObjectURL(image)} alt="Preview" />
          <button onClick={() => setImage(null)} className="remove-image-button">
            <XCircle size={18} />
          </button>
        </div>
      )}

      <div className="input-container">
        {isStreaming ? (
          <button className="button-base stop-button" onClick={handleStop}>
            <Square size={16} />
            Parar Geração
          </button>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              className="attach-button"
              onClick={() => fileInputRef.current.click()}
              disabled={isLoading}
              aria-label="Anexar imagem"
            >
              <Paperclip size={18} />
            </button>

            <textarea
              ref={textareaRef}
              className="input-field"
              placeholder="Digite sua mensagem ou cole uma imagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              rows={1}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={(!input.trim() && !image) || isLoading}
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
