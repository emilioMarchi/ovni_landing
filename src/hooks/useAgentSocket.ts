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
    });

    const unsubMsg = globalAgentClient.onMessage((msg: ServerMessage) => {
      if (msg.type === 'status') {
        const statusVal = msg.state || msg.status || 'idle';
        setAgentStatus(statusVal === 'transcribing' ? 'listening' : (statusVal as any));
      } else if (msg.type === 'text_response') {
        // Agregar respuesta del agente con el array de frases recibido
        const agentMsg: ChatMessage = {
          id: `agent_${Date.now()}`,
          sender: 'agent',
          text: msg.text,
          sentences: msg.sentences,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else if (msg.type === 'text_stream') {
        setMessages((prev) => {
          const existingIdx = prev.findIndex((m) => m.id === msg.messageId);
          if (existingIdx !== -1) {
            const updated = [...prev];
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
              ...prev,
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

    // Agregar mensaje del usuario a la lista inmediatamente
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    globalAgentClient.sendText(text.trim());
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
