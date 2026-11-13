import {
  ConnectionState,
  ServerMessage,
} from './agentTypes';
import { MockAgentServer } from './mockAgentServer';
import {
  AGENT_BACKENDS,
  AgentBackendId,
  DEFAULT_BACKEND_ID,
} from './agentBackends';

const MAX_RETRIES = 5;
const RETRY_BASE_MS = 1500; // primer reintento a los 1.5s

export class AgentClient {
  private ws: WebSocket | null = null;
  private mockServer: MockAgentServer | null = null;
  private connectionState: ConnectionState = 'disconnected';
  private onStateChangeCallbacks: Set<(state: ConnectionState) => void> = new Set();
  private onMessageCallbacks: Set<(msg: ServerMessage) => void> = new Set();
  private isMockMode = false;
  private backendId: AgentBackendId = DEFAULT_BACKEND_ID;

  /** Cola de mensajes de texto que no pudieron enviarse */
  private pendingTexts: string[] = [];

  /** Control de reconexión automática */
  private retryCount = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true; // false solo cuando el usuario llama disconnect()

  constructor() {
    this.isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_AGENT === 'true';
  }

  public getBackendId(): AgentBackendId {
    return this.backendId;
  }

  public getBackend() {
    return AGENT_BACKENDS[this.backendId];
  }

  /**
   * Cambia el destino del socket y reconecta. La sesion actual no se arrastra
   * al backend nuevo porque cada uno mantiene su propio estado.
   */
  public setBackend(id: AgentBackendId): void {
    if (id === this.backendId) return;
    this.backendId = id;
    this.pendingTexts = [];

    const wasActive = this.connectionState !== 'disconnected';
    this.disconnect();
    if (wasActive) {
      this.shouldReconnect = true;
      this.connect();
    }
  }

  public connect(): void {
    if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
      return;
    }

    this.cancelRetry();
    this.setConnectionState('connecting');

    if (this.isMockMode) {
      this.mockServer = new MockAgentServer((msg) => {
        this.emitMessage(msg);
      });
      setTimeout(() => {
        this.setConnectionState('connected');
        this.flushPending();
      }, 300);
      return;
    }

    const wsUrl = this.getBackend().url;

    try {
      console.log('[AgentClient] Conectando a WebSocket:', wsUrl);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[AgentClient] Conexión establecida con éxito');
        this.retryCount = 0;
        this.setConnectionState('connected');
        this.flushPending();
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

      this.ws.onclose = (ev) => {
        console.log(`[AgentClient] Conexión WebSocket cerrada (code=${ev.code})`);
        this.ws = null;

        if (this.shouldReconnect) {
          this.scheduleRetry();
        } else {
          this.setConnectionState('disconnected');
        }
      };
    } catch (err) {
      console.error('Error al inicializar WebSocket:', err);
      this.setConnectionState('error');
      if (this.shouldReconnect) this.scheduleRetry();
    }
  }

  public disconnect(): void {
    this.shouldReconnect = false;
    this.cancelRetry();

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.mockServer = null;
    this.setConnectionState('disconnected');
  }

  /**
   * Envía texto al agente. Si el WS no está abierto, encola el mensaje
   * y retorna false para que la UI muestre el estado de error.
   */
  public sendText(text: string): boolean {
    if (this.isMockMode && this.mockServer) {
      this.mockServer.processTextMessage(text);
      return true;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const payload = { type: 'text', content: text };
      this.ws.send(JSON.stringify(payload));
      return true;
    } else {
      console.warn('[AgentClient] WS no está abierto — encolando mensaje:', text);
      this.pendingTexts.push(text);
      // Intentar reconectar si estamos desconectados
      if (this.connectionState === 'disconnected' || this.connectionState === 'error') {
        this.shouldReconnect = true;
        this.connect();
      }
      return false;
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

  /** Envía los mensajes encolados durante una desconexión */
  private flushPending(): void {
    if (this.pendingTexts.length === 0) return;
    const toSend = [...this.pendingTexts];
    this.pendingTexts = [];
    console.log(`[AgentClient] Enviando ${toSend.length} mensaje(s) encolado(s)`);
    for (const text of toSend) {
      this.sendText(text);
    }
  }

  private scheduleRetry(): void {
    if (this.retryCount >= MAX_RETRIES) {
      console.warn('[AgentClient] Máximo de reintentos alcanzado');
      this.setConnectionState('error');
      return;
    }

    // Backoff exponencial: 1.5s, 3s, 6s, 12s, 24s
    const delay = RETRY_BASE_MS * Math.pow(2, this.retryCount);
    this.retryCount++;
    console.log(`[AgentClient] Reintentando conexión en ${delay}ms (intento ${this.retryCount}/${MAX_RETRIES})`);

    this.setConnectionState('connecting');
    this.retryTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private cancelRetry(): void {
    if (this.retryTimer !== null) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    this.retryCount = 0;
  }

  public get state(): ConnectionState {
    return this.connectionState;
  }
}

export const globalAgentClient = new AgentClient();
