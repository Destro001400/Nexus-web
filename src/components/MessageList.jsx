import React from 'react';
import { useTheme } from '../lib/ThemeContext';
import Feedback from './Feedback';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bot, User, Loader2, Copy, Check } from 'lucide-react';

// Note: Chat.css is imported in Chat.jsx, so no need to import it here.

const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const { theme } = useTheme();
    const [isCopied, setIsCopied] = React.useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const codeText = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(codeText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return !inline && match ? (
        <div className="code-block-wrapper">
            <SyntaxHighlighter
                style={theme === 'dark' ? vscDarkPlus : vs}
                language={match[1]}
                PreTag="div"
                {...props}
            >
                {codeText}
            </SyntaxHighlighter>
            <button className="copy-button" onClick={handleCopy} aria-label="Copiar código">
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
            </button>
        </div>
    ) : (
        <code className={className} {...props}>
            {children}
        </code>
    );
};

const MessageList = ({ messages, isLoading, currentStatus, messagesEndRef, conversationId, userId }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div key={index} className={`message-bubble ${message.role === 'user' ? 'user' : 'assistant'}`}>
          <div className="message-avatar">
            {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
          </div>
          <div className="message-content">
            <ReactMarkdown components={{ code: CodeBlock }} remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
            {message.role === 'assistant' && conversationId && userId && (
              <Feedback conversationId={conversationId} messageIndex={index} userId={userId} />
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="message-bubble assistant loading-indicator">
            <div className="message-avatar">
                <Bot size={20} />
            </div>
            <div className="message-content">
                <Loader2 className="loading-spinner" size={20} />
                <span>{currentStatus || 'Pensando...'}</span>
            </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;