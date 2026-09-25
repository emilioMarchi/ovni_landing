import {
  ConnectionState,
  ServerMessage,
} from './agentTypes';
import { MockAgentServer } from './mockAgentServer';

export class AgentClient {
  private ws: WebSocket | null = null;
  private mockServer: MockAgentServer | null = null;
  private connectionState: ConnectionState = 'disconnected';
  private onStateChangeCallbacks: Set<(state: ConnectionState) => void> = new Set();
  private onMessageCallbacks: Set<(msg: ServerMessage) => void> = new Set();
  private isMockMode = false;

  constructor() {
    const wsUrl = process.env.NEXT_PUBLIC_AGENT_SERVER_URL || 'ws://localhost:8000/ws/agent';
    const forceMock = process.env.NEXT_PUBLIC_USE_MOCK_AGENT === 'true';
    this.isMockMode = forceMock;
  }

  public connect(): void {
    if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
      return;
    }

    this.setConnectionState('connecting');

    if (this.isMockMode) {
      this.mockServer = new MockAgentServer((msg) => {
        this.emitMessage(msg);
      });
      setTimeout(() => {
        this.setConnectionState('connected');
      }, 300);
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_AGENT_SERVER_URL || 'ws://localhost:8000/ws/agent';

    try {
      console.log('[AgentClient] Conectando a WebSocket:', wsUrl);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[AgentClient] Conexión establecida con éxito');
        this.setConnectionState('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          if (typeof event.data === 'string') {
            const data: ServerMessage = JSON.parse(event.data);
            this.emitMessage(data);
          }
        } catch (e) {
          console.error('Error parseando mensaje del servidor WebSocket:', e);
        }
      };

      this.ws.onerror = (err) => {
        console.error('Error de conexión WebSocket:', err);
        this.setConnectionState('error');
      };

      this.ws.onclose = () => {
        console.log('[AgentClient] Conexión WebSocket cerrada');
        this.setConnectionState('disconnected');
      };
    } catch (err) {
      console.error('Error al inicializar WebSocket:', err);
      this.setConnectionState('error');
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.mockServer = null;
    this.setConnectionState('disconnected');
  }

  public sendText(text: string): void {
    if (this.isMockMode && this.mockServer) {
      this.mockServer.processTextMessage(text);
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const payload = { type: 'text', content: text };
      this.ws.send(JSON.stringify(payload));
    } else {
      console.warn('[AgentClient] Intentando enviar mensaje pero WebSocket no está abierto');
    }
  }

  public sendAudioChunk(audioId: string, blob: Blob): void {
    if (this.isMockMode && this.mockServer) {
      this.mockServer.processAudioChunk(blob);
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(blob);
    }
  }

  public onStateChange(callback: (state: ConnectionState) => void): () => void {
    this.onStateChangeCallbacks.add(callback);
    callback(this.connectionState);
    return () => this.onStateChangeCallbacks.delete(callback);
  }

  public onMessage(callback: (msg: ServerMessage) => void): () => void {
    this.onMessageCallbacks.add(callback);
    return () => this.onMessageCallbacks.delete(callback);
  }

  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.onStateChangeCallbacks.forEach((cb) => cb(state));
  }

  private emitMessage(msg: ServerMessage): void {
    this.onMessageCallbacks.forEach((cb) => cb(msg));
  }

  public get state(): ConnectionState {
    return this.connectionState;
  }
}

export const globalAgentClient = new AgentClient();
