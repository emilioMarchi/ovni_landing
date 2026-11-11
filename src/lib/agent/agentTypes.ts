/**
 * Tipos de mensajes y estados para la comunicación con el servidor de agentes
 */

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export type AgentMode = 'voice' | 'chat';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  sentences?: string[];
  timestamp: number;
  audioUrl?: string;
  isStreaming?: boolean;
}

export interface AgentServerConfig {
  wsUrl?: string;
  useMock?: boolean;
}

export interface ClientAudioMessage {
  type: 'audio_chunk';
  audioId: string;
  blob: Blob;
}

export interface ClientTextMessage {
  type: 'text';
  content: string;
}

export type ClientMessage = ClientAudioMessage | ClientTextMessage;

export interface ServerTextStreamMessage {
  type: 'text_stream';
  messageId: string;
  delta: string;
  isDone: boolean;
}

export interface ServerTextResponseMessage {
  type: 'text_response';
  text: string;
  sentences?: string[];
  count?: number;
}

export interface ServerAudioStreamMessage {
  type: 'audio_stream';
  messageId: string;
  audioChunkUrl: string;
  isDone: boolean;
}

export interface ServerStatusMessage {
  type: 'status';
  state?: 'listening' | 'processing' | 'speaking' | 'idle' | 'transcribing';
  status?: 'listening' | 'processing' | 'speaking' | 'idle';
}

export interface ServerSTTResultMessage {
  type: 'stt_result';
  text: string;
}

export type ServerMessage =
  | ServerTextStreamMessage
  | ServerTextResponseMessage
  | ServerAudioStreamMessage
  | ServerStatusMessage
  | ServerSTTResultMessage;
