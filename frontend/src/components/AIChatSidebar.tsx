'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader } from 'lucide-react';
import { llmAPI } from '@/lib/api';
import { aiSessionStorage, AIMessage } from '@/lib/storage';

interface AIChatSidebarProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatSidebar({ productId, isOpen, onClose }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session on mount
  useEffect(() => {
    const session = aiSessionStorage.getSession(productId);
    if (session) {
      setMessages(session.messages);
      setSessionValid(aiSessionStorage.isSessionValid(productId));
    } else {
      aiSessionStorage.createSession(productId);
      setSessionValid(true);
    }
  }, [productId, isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check session validity periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionValid(aiSessionStorage.isSessionValid(productId));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [productId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !sessionValid) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    aiSessionStorage.addMessage(productId, userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await llmAPI.chatbotAnalysis(productId, [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        userMessage,
      ]);

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response.analysis || response.response || 'Unable to process your request.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      aiSessionStorage.addMessage(productId, assistantMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-linear-to-r from-blue-500 to-blue-600">
          <h3 className="font-semibold text-white">AI Assistant</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Session Status */}
        {!sessionValid && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
            <p className="text-xs text-yellow-800">
              Your session has expired. Please refresh the page to continue.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-600 py-8">
              <p className="text-sm">
                Ask me anything about this product! I can help with specifications, comparisons, and more.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
                <Loader size={16} className="animate-spin text-blue-600" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        {sessionValid ? (
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 space-y-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this product..."
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="border-t border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-600">Session expired</p>
          </div>
        )}
      </div>
    </div>
  );
}
