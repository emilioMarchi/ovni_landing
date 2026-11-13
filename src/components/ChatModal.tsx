'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ConnectionState } from '@/lib/agent/agentTypes';
import {
  X,
  Send,
  Bot,
  User,
  WifiOff,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onRetryMessage?: (msgId: string) => void;
  agentStatus: 'idle' | 'listening' | 'processing' | 'speaking';
  connectionState: ConnectionState;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onRetryMessage,
  agentStatus,
  connectionState,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // En mobile, enfocar el input después de la animación de apertura
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting';
  const isError = connectionState === 'error';

  const connectionLabel = isConnected
    ? agentStatus === 'processing'
      ? 'Procesando'
      : agentStatus === 'speaking'
      ? 'Respondiendo'
      : agentStatus === 'listening'
      ? 'Grabando'
      : 'En línea'
    : isConnecting
    ? 'Conectando…'
    : isError
    ? 'Sin conexión'
    : 'Desconectado';

  const connectionDot = isConnected
    ? agentStatus !== 'idle'
      ? 'bg-amarillo-muted animate-ping'
      : 'bg-emerald-500'
    : isConnecting
    ? 'bg-amarillo-muted animate-pulse'
    : 'bg-red-500';

  return (
    <>
      {/* Panel deslizante — no oscurece el fondo */}
      <div
        className={`
          fixed z-40
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]

          /* Mobile: panel inferior que sube desde abajo */
          bottom-16 left-2 right-2 max-h-[70dvh]
          rounded-2xl

          /* Desktop: panel flotante esquina inferior-derecha */
          md:bottom-20 md:right-6 md:left-auto md:w-[380px] md:max-h-[520px]

          flex flex-col
          bg-gris-surface border border-gris-border
          shadow-2xl shadow-black/40

          ${
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }
        `}
        aria-hidden={!isOpen}
      >
        {/* ── Banner de estado de conexión (solo cuando hay problema) ── */}
        {(isConnecting || !isConnected) && (
          <div
            className={`flex items-center gap-2 px-4 py-2 text-xs font-inter rounded-t-2xl ${
              isConnecting
                ? 'bg-amarillo-muted/10 text-amarillo-muted border-b border-amarillo-muted/20'
                : 'bg-red-500/10 text-red-400 border-b border-red-500/20'
            }`}
          >
            {isConnecting ? (
              <Loader2 className="w-3 h-3 animate-spin shrink-0" />
            ) : (
              <WifiOff className="w-3 h-3 shrink-0" />
            )}
            <span>
              {isConnecting
                ? 'Conectando al servidor…'
                : 'Sin conexión — Los mensajes se enviarán cuando se restablezca'}
            </span>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gris-border bg-gris-oscuro/50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-celeste-muted/20 border border-celeste-muted/40 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-celeste-muted" />
            </div>
            <div>
              <h3 className="font-unica text-texto-main text-xs tracking-wide">
                AGENTE OVNISTUDIO
              </h3>
              <p className="font-inter text-[11px] text-texto-sub font-normal flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${connectionDot}`} />
                {connectionLabel}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-texto-sub hover:text-texto-main rounded-lg hover:bg-gris-border/50 transition-colors"
            aria-label="Cerrar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Lista de mensajes ── */}
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 overscroll-contain min-h-0"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-texto-sub gap-2 py-8">
              <Bot className="w-7 h-7 text-celeste-muted/60" />
              <p className="font-inter text-sm max-w-[220px] leading-relaxed">
                ¡Hola! Podés preguntarme sobre los sistemas cognitivos o automatizaciones de OVNISTUDIO.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-6 h-6 rounded-full bg-celeste-muted/20 border border-celeste-muted/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-celeste-muted" />
                  </div>
                )}

                <div className="flex flex-col items-end gap-1 max-w-[82%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-sm font-inter leading-relaxed ${
                      msg.sender === 'user'
                        ? `bg-celeste-muted text-gris-oscuro font-medium rounded-br-none ${
                            msg.status === 'failed'
                              ? 'opacity-70 bg-red-400'
                              : ''
                          }`
                        : 'bg-gris-oscuro border border-gris-border text-texto-main rounded-bl-none'
                    }`}
                  >
                    {msg.sentences && msg.sentences.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
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

                  {/* Estado del mensaje de usuario */}
                  {msg.sender === 'user' && msg.status === 'failed' && (
                    <button
                      onClick={() => onRetryMessage?.(msg.id)}
                      className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors font-inter"
                    >
                      <AlertCircle className="w-3 h-3" />
                      No se pudo enviar
                      <RefreshCw className="w-3 h-3 ml-0.5" />
                      Reintentar
                    </button>
                  )}
                  {msg.sender === 'user' && msg.status === 'sending' && (
                    <span className="flex items-center gap-1 text-[11px] text-texto-sub/60 font-inter">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Enviando…
                    </span>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-amarillo-muted/20 border border-amarillo-muted/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-amarillo-muted" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input de mensaje ── */}
        <form
          onSubmit={handleSend}
          className="p-2.5 border-t border-gris-border bg-gris-oscuro/40 flex items-center gap-2 rounded-b-2xl"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={
              isConnected ? 'Escribí tu mensaje…' : 'Sin conexión — igual podés escribir'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-gris-oscuro border border-gris-border rounded-xl px-3.5 py-2 text-sm text-texto-main placeholder:text-texto-sub/50 focus:outline-none focus:border-celeste-muted/60 transition-colors"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!input.trim()}
            className="!px-3 !py-2 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </>
  );
};
