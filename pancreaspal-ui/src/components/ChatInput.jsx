import React, { useState } from 'react';

export function ChatInput({ onSendMessage, isLoading, disabled, filePill, onUploadClick, compact }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = message.trim() && !isLoading && !disabled;

  return (
    <div
      className="w-full rounded-2xl flex flex-col overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {/* File pill slot — shown inside card top when a file is loaded */}
      {filePill && (
        <div className="px-4 pt-3.5 pb-0">
          {filePill}
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? 'Upload patient history to begin…' : 'Ask me anything…'}
        disabled={isLoading || disabled}
        rows={compact ? 2 : 5}
        className="w-full px-5 py-4 bg-transparent outline-none resize-none text-gray-800 placeholder-gray-400 text-[15px] leading-relaxed"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      />

      {/* Bottom toolbar */}
      <div className="flex justify-between items-center px-4 pb-3.5">
        {/* Upload paperclip */}
        <button
          onClick={onUploadClick}
          title="Upload patient history PDF"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/5 text-gray-400 hover:text-gray-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        {/* Circular send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150"
          style={{
            background: canSend ? '#1e293b' : 'rgba(0,0,0,0.08)',
          }}
          title="Send"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke={canSend ? '#fff' : '#aaa'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
