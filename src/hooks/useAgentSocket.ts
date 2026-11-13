'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChatMessage,
  ConnectionState,
  ServerMessage,
} from '@/lib/agent/agentTypes';
import { globalAgentClient } from '@/lib/agent/agentClient';
import {
  AGENT_BACKEND_LIST,
  AGENT_BACKENDS,
  AgentBackendId,
} from '@/lib/agent/agentBackends';

export function useAgentSocket() {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('disconnected');
  const [agentStatus, setAgentStatus] = useState<
    'idle' | 'listening' | 'processing' | 'speaking'
  >('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [backendId, setBackendId] = useState<AgentBackendId>(
    globalAgentClient.getBackendId(),
  );
  const backend = AGENT_BACKENDS[backendId];

  useEffect(() => {
    // Conectar automáticamente al montar
    globalAgentClient.connect();

    const unsubState = globalAgentClient.onStateChange((state) => {
      setConnectionState(state);

      // Cuando reconectamos, marcar como "sent" los mensajes que estaban en cola (failed → sending)
      if (state === 'connected') {
        setMessages((prev) =>
          prev.map((m) =>
            m.sender === 'user' && m.status === 'failed'
              ? { ...m, status: 'sent' }
              : m,
          ),
        );
      }
    });

    const unsubMsg = globalAgentClient.onMessage((msg: ServerMessage) => {
      if (msg.type === 'status') {
        const statusVal = msg.state || msg.status || 'idle';
        setAgentStatus(statusVal === 'transcribing' ? 'listening' : (statusVal as any));
      } else if (msg.type === 'text_response') {
        // Cuando el agente responde, el último mensaje del usuario se confirma como enviado
        setMessages((prev) => {
          const lastUserIdx = [...prev].reverse().findIndex((m) => m.sender === 'user');
          if (lastUserIdx === -1) return prev;
          const realIdx = prev.length - 1 - lastUserIdx;
          const updated = [...prev];
          if (updated[realIdx].status !== 'sent') {
            updated[realIdx] = { ...updated[realIdx], status: 'sent' };
          }

          const agentMsg: ChatMessage = {
            id: `agent_${Date.now()}`,
            sender: 'agent',
            text: msg.text,
            sentences: msg.sentences,
            timestamp: Date.now(),
          };
          return [...updated, agentMsg];
        });
      } else if (msg.type === 'text_stream') {
        setMessages((prev) => {
          // Marcar el último mensaje de usuario como enviado cuando arranca el stream
          const lastUserIdx = [...prev].reverse().findIndex((m) => m.sender === 'user');

          const withConfirmed =
            lastUserIdx !== -1
              ? (() => {
                  const realIdx = prev.length - 1 - lastUserIdx;
                  const updated = [...prev];
                  if (updated[realIdx].status !== 'sent') {
                    updated[realIdx] = { ...updated[realIdx], status: 'sent' };
                  }
                  return updated;
                })()
              : prev;

          const existingIdx = withConfirmed.findIndex((m) => m.id === msg.messageId);
          if (existingIdx !== -1) {
            const updated = [...withConfirmed];
            const currentMsg = updated[existingIdx];
            const newText = currentMsg.text + msg.delta;
            const newSentences = newText
              .split(/(?<=[.!?])\s+/)
              .filter((s) => s.trim().length > 0);

            updated[existingIdx] = {
              ...currentMsg,
              text: newText,
              sentences: newSentences.length > 0 ? newSentences : [newText],
              isStreaming: !msg.isDone,
            };
            return updated;
          } else {
            const newText = msg.delta;
            return [
              ...withConfirmed,
              {
                id: msg.messageId,
                sender: 'agent',
                text: newText,
                sentences: [newText],
                timestamp: Date.now(),
                isStreaming: !msg.isDone,
              },
            ];
          }
        });
      } else if (msg.type === 'stt_result') {
        // Mensaje transcrito del micro
        const userAudioMsg: ChatMessage = {
          id: `stt_${Date.now()}`,
          sender: 'user',
          text: `🎤 "${msg.text}"`,
          timestamp: Date.now(),
          status: 'sent',
        };
        setMessages((prev) => [...prev, userAudioMsg]);
      }
    });

    return () => {
      unsubState();
      unsubMsg();
    };
  }, []);

  const sendTextMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const msgId = `user_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: msgId,
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMsg]);

    // Intentar enviar; si falla, marcar el mensaje como fallido
    const sent = globalAgentClient.sendText(text.trim());
    if (!sent) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: 'failed' } : m)),
      );
    }
  }, []);

  const retrySendMessage = useCallback((msgId: string) => {
    setMessages((prev) => {
      const msg = prev.find((m) => m.id === msgId);
      if (!msg || msg.status !== 'failed') return prev;

      const sent = globalAgentClient.sendText(msg.text);
      return prev.map((m) =>
        m.id === msgId ? { ...m, status: sent ? 'sending' : 'failed' } : m,
      );
    });
  }, []);

  const sendAudioChunk = useCallback((audioId: string, blob: Blob) => {
    globalAgentClient.sendAudioChunk(audioId, blob);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const switchBackend = useCallback((id: AgentBackendId) => {
    setBackendId(id);
    // La conversacion anterior no aplica al backend nuevo.
    setMessages([]);
    setAgentStatus('idle');
    globalAgentClient.setBackend(id);
  }, []);

  return {
    connectionState,
    agentStatus,
    setAgentStatus,
    messages,
    sendTextMessage,
    retrySendMessage,
    sendAudioChunk,
    clearMessages,
    connect: () => globalAgentClient.connect(),
    disconnect: () => globalAgentClient.disconnect(),
    backend,
    backendId,
    switchBackend,
    availableBackends: AGENT_BACKEND_LIST,
  };
}
