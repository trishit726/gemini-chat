// ─────────────────────────────────────────────────────────────
//  Multi-Model Streaming Chat — React Frontend
//  Uses Vercel AI SDK's `useChat` hook for automatic streaming
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import './App.css';

function App() {
  const [activeModel, setActiveModel] = useState('gemini');
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // @ai-sdk/react v3's useChat returns sendMessage (not handleSubmit/input).
  // We manage input state ourselves and call sendMessage directly.
  const {
    messages,
    sendMessage,
    status,
    error,
    setMessages,
  } = useChat({
    api: '/api/chat',
    body: { modelType: activeModel },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const switchModel = (model) => {
    setActiveModel(model);
    setMessages([]);
    setInput('');
  };

  const modelLabel = activeModel === 'gemini' ? 'Gemini 2.5 Flash' : 'Kimi K2.5';

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header-title">
          <svg className="sparkle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          </svg>
          Multi-Model Chat
        </h1>

        <div className="model-selector">
          <button
            className={`model-btn ${activeModel === 'gemini' ? 'active gemini-active' : ''}`}
            onClick={() => switchModel('gemini')}
          >
            ✦ Gemini
          </button>
          <button
            className={`model-btn ${activeModel === 'nim' ? 'active nim-active' : ''}`}
            onClick={() => switchModel('nim')}
          >
            ⚡ Kimi K2.5
          </button>
        </div>
      </header>

      <div className="chat-container">
        <div className="chat-message-list">
          {messages.length === 0 && !isLoading && (
            <div className="empty-state">
              <div className="empty-icon">
                {activeModel === 'gemini' ? '✦' : '⚡'}
              </div>
              <h2>Chat with {modelLabel}</h2>
              <p>Powered by Vercel AI SDK with real-time streaming</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className={`avatar model ${activeModel}`}>
                  {activeModel === 'gemini' ? '✦' : '⚡'}
                </div>
              )}
              <div className={`message-bubble ${msg.role === 'assistant' ? activeModel : ''}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="message-wrapper assistant">
              <div className={`avatar model ${activeModel}`}>
                {activeModel === 'gemini' ? '✦' : '⚡'}
              </div>
              <div className="message-bubble typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          {error && (
            <div className="message-wrapper assistant">
              <div className="avatar model error-avatar">!</div>
              <div className="message-bubble error-bubble">
                Error: {error.message || error.toString()}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-container">
        <div className="input-wrapper-limit">
          <form className="input-wrapper" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <textarea
              ref={textareaRef}
              className="input-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${modelLabel}...`}
              rows={1}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!input.trim() || isLoading}
            >
              <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <div className="footer-disclaimer">
            Streaming via Vercel AI SDK · Models can make mistakes
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
