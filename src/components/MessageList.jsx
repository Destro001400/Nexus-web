import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import './MessageList.css';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
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
            <SyntaxHighlighter style={coldarkDark} language={match[1]} PreTag="div" {...props}>
                {codeText}
            </SyntaxHighlighter>
            <button className="copy-button" onClick={handleCopy}>
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                {isCopied ? 'Copiado!' : 'Copiar'}
            </button>
        </div>
    ) : (
        <code className={className} {...props}>
            {children}
        </code>
    );
};

const MessageList = ({ messages, isLoading, currentStatus, messagesEndRef }) => {
  return (
    <div className="messages">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
          {message.role !== 'user' && (
            <div className="bot-avatar">
              <Sparkles />
            </div>
          )}
          <div className="message-content">
            <ReactMarkdown components={{ code: CodeBlock }} remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="message bot-message">
          <div className="bot-avatar">
            <Sparkles />
          </div>
          <div className="message-content loading">
            <Loader2 className="spinner" />
            <span style={{ marginLeft: '0.5rem' }}>{currentStatus}</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
