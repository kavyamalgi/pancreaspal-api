import React from 'react';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MessageList({ messages, isLoading }) {
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <span className="text-4xl mb-4">💬</span>
        <p>No messages yet. Start by asking a medical question!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-2xl px-4 py-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-100 text-gray-900'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {msg.role === 'assistant' ? (
              <div className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-li:my-0 prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1 prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-200 prose-pre:p-3 prose-pre:rounded prose-a:text-blue-600 prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm">{msg.content}</p>
            )}
            {msg.timestamp && (
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(msg.timestamp), 'HH:mm a')}
              </p>
            )}

            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  [Sources: {msg.sources.length}]
                </p>
                <ul className="text-xs space-y-1">
                  {msg.sources.map((source, idx) => (
                    <li key={idx} className="text-gray-700">
                      • {source.title || source.source}
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 inline-block"
                        >
                          <ExternalLink size={12} className="inline" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 px-4 py-3 rounded-lg">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
