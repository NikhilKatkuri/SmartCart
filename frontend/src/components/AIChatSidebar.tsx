'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader, Sparkles } from 'lucide-react';
import { aiAPI } from '@/lib/api';
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
  const [status, setStatus] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionValid(aiSessionStorage.isSessionValid(productId));
    }, 60000);

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
    setStatus('Preparing AI context...');

    const assistantMessage: AIMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    let assistantContent = '';

    try {
      const sessionId =
        aiSessionStorage.getSessionId(productId) ||
        aiSessionStorage.createSession(productId).sessionId ||
        `sc_${Date.now()}`;

      await aiAPI.queryProduct({
        productId,
        sessionId,
        query: userMessage.content,
        conversationHistory: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        onEvent: (event) => {
          if (event.type === 'status') {
            setStatus(event.message || 'Thinking...');
          }
          if (event.type === 'chunk' && event.data?.content) {
            assistantContent += event.data.content;
            setMessages((prev) => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              const lastMessage = updated[lastIndex];
              if (lastMessage?.role === 'assistant') {
                updated[lastIndex] = {
                  ...lastMessage,
                  content: `${lastMessage.content}${event.data.content}`,
                };
              }
              return updated;
            });
          }
          if (event.type === 'complete') {
            setStatus('');
            if (assistantContent.trim()) {
              aiSessionStorage.addMessage(productId, {
                role: 'assistant',
                content: assistantContent.trim(),
                timestamp: Date.now(),
              });
            }
          }
        },
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now(),
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      setStatus('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute right-6 top-6 bottom-6 w-full max-w-md glass-panel rounded-3xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles size={16} />
            SmartCart AI
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-sm text-muted">
              Ask about fit, specs, or whether it matches your needs. I use product reviews and specs.
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  message.role === 'user'
                    ? 'bg-black text-white'
                    : 'bg-white/70 text-black border border-white/40'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/70 text-black px-4 py-3 rounded-2xl text-sm flex items-center gap-2 border border-white/40">
                <Loader size={14} className="animate-spin" />
                <span>{status || 'Thinking...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-white/40">
          {!sessionValid && (
            <p className="text-xs text-red-600 mb-2">Session expired. Please reload.</p>
          )}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this product..."
              className="flex-1 px-4 py-2.5 rounded-full border border-white/60 bg-white/80 focus:outline-none focus:ring-2 focus:ring-black/10 text-sm"
              disabled={!sessionValid}
            />
            <button
              type="submit"
              disabled={!sessionValid || isLoading}
              className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/90 disabled:bg-gray-400"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
