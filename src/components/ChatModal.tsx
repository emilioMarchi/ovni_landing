'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/agent/agentTypes';
import { X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  agentStatus: 'idle' | 'listening' | 'processing' | 'speaking';
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  agentStatus,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg h-[520px] bg-gris-surface border border-gris-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header del Chat */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gris-border bg-gris-oscuro/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-celeste-muted/20 border border-celeste-muted/40 flex items-center justify-center">
              <Bot className="w-4 h-4 text-celeste-muted" />
            </div>
            <div>
              <h3 className="font-unica text-texto-main text-sm tracking-wide">
                AGENTE OVNISTUDIO
              </h3>
              <p className="font-inter text-xs text-texto-sub font-normal flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    agentStatus !== 'idle'
                      ? 'bg-amarillo-muted animate-ping'
                      : 'bg-emerald-500'
                  }`}
                />
                {agentStatus === 'processing'
                  ? 'Procesando'
                  : agentStatus === 'speaking'
                  ? 'Respondiendo'
                  : agentStatus === 'listening'
                  ? 'Grabando'
                  : 'En línea'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-texto-sub hover:text-texto-main rounded-lg hover:bg-gris-border/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo con lista de mensajes */}
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 overscroll-contain"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-texto-sub gap-2">
              <Bot className="w-8 h-8 text-celeste-muted/60" />
              <p className="font-inter text-sm">
                ¡Hola! Podés hacerme preguntas sobre los sistemas cognitivos o automatizaciones de OVNISTUDIO.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-7 h-7 rounded-full bg-celeste-muted/20 border border-celeste-muted/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-celeste-muted" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-inter leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-celeste-muted text-gris-oscuro font-medium rounded-br-none'
                      : 'bg-gris-oscuro border border-gris-border text-texto-main rounded-bl-none'
                  }`}
                >
                  {msg.sentences && msg.sentences.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {msg.sentences.map((sentence, sIdx) => (
                        <p key={sIdx} className="leading-relaxed">
                          {sentence}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <span>{msg.text}</span>
                  )}
                  {msg.isStreaming && (
                    <span className="inline-block w-1.5 h-3 ml-1 bg-celeste-muted animate-pulse" />
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-amarillo-muted/20 border border-amarillo-muted/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-amarillo-muted" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer con input de mensaje */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-gris-border bg-gris-oscuro/40 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Escribí tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-gris-oscuro border border-gris-border rounded-xl px-4 py-2.5 text-sm text-texto-main placeholder:text-texto-sub/50 focus:outline-none focus:border-celeste-muted/60 transition-colors"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!input.trim()}
            className="!px-3.5"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

      </div>
    </div>
  );
};
