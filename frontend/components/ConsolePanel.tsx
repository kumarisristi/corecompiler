'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ConsoleMessage {
  id: string;
  type: 'log' | 'error' | 'warn';
  message: string;
  timestamp: Date;
}

interface ConsolePanelProps {
  onConsoleLog?: (message: string, type: 'log' | 'error' | 'warn') => void;
  className?: string;
  maxHeight?: string;
}

const ConsolePanel: React.FC<ConsolePanelProps> = ({
  onConsoleLog,
  className = '',
  maxHeight = '200px'
}) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = (message: string, type: 'log' | 'error' | 'warn') => {
    const newMessage: ConsoleMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage].slice(-100)); // Keep only last 100 messages

    // Call parent callback if provided
    if (onConsoleLog) {
      onConsoleLog(message, type);
    }
  };

  // Expose addMessage function globally for iframe access
  useEffect(() => {
    (window as any).htmlRunnerConsole = addMessage;
    return () => {
      delete (window as any).htmlRunnerConsole;
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const clearMessages = () => {
    setMessages([]);
  };

  const getMessageIcon = (type: 'log' | 'error' | 'warn') => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getMessageStyle = (type: 'log' | 'error' | 'warn') => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warn':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`console-panel bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Console</span>
          {messages.length > 0 && (
            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
              {messages.length}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▾' : '▸'}
          </button>
          
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="p-1 text-gray-500 hover:text-red-500 transition-colors"
              title="Clear Console"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {isExpanded && (
        <div 
          className="overflow-y-auto p-2 space-y-1"
          style={{ maxHeight }}
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-4 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <span>💻</span>
                <span>Console output will appear here</span>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 p-2 rounded border text-sm ${getMessageStyle(msg.type)}`}
              >
                <span className="flex-shrink-0 mt-0.5 text-xs">
                  {getMessageIcon(msg.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium uppercase tracking-wide">
                      {msg.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="break-words whitespace-pre-wrap font-mono text-xs">
                    {msg.message}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

// Hook for easy console integration
export const useHTMLRunnerConsole = () => {
  const addMessage = (message: string, type: 'log' | 'error' | 'warn') => {
    if ((window as any).htmlRunnerConsole) {
      (window as any).htmlRunnerConsole(message, type);
    }
  };

  return { addMessage };
};

export default ConsolePanel;