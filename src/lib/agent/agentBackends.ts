export type AgentBackendId = 'local' | 'remote';

export interface AgentBackend {
  id: AgentBackendId;
  label: string;
  url: string;
  /**
   * El backend remoto expone STT y TTS, el agente local de IA_LOCAL_RAG solo
   * responde texto: no procesa los chunks de audio del microfono.
   */
  supportsVoice: boolean;
}

export const AGENT_BACKENDS: Record<AgentBackendId, AgentBackend> = {
  local: {
    id: 'local',
    label: 'IA local',
    url: process.env.NEXT_PUBLIC_AGENT_LOCAL_URL || 'ws://localhost:8080/ws/agent',
    supportsVoice: true,
  },
  remote: {
    id: 'remote',
    label: 'Servidor OVNI',
    url: process.env.NEXT_PUBLIC_AGENT_SERVER_URL || 'wss://agente.ovnistudio.com/ws',
    supportsVoice: true,
  },
};

export const AGENT_BACKEND_LIST: AgentBackend[] = [
  AGENT_BACKENDS.local,
  AGENT_BACKENDS.remote,
];

export const DEFAULT_BACKEND_ID: AgentBackendId =
  process.env.NEXT_PUBLIC_AGENT_BACKEND === 'local' ? 'local' : 'remote';
