/**
 * Manager para la cola de envíos de bloques de audio (audioQueue)
 */

export interface AudioItem {
  id: string;
  blob: Blob;
  timestamp: number;
  durationMs?: number;
}

type Listener = (queue: AudioItem[]) => void;

export class AudioQueueManager {
  private queue: AudioItem[] = [];
  private listeners: Set<Listener> = new Set();

  /** Agregar un nuevo blob de audio a la cola */
  public enqueue(blob: Blob, durationMs?: number): AudioItem {
    const item: AudioItem = {
      id: `audio_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      blob,
      timestamp: Date.now(),
      durationMs,
    };
    this.queue.push(item);
    this.notify();
    return item;
  }

  /** Extraer el primer audio de la cola */
  public dequeue(): AudioItem | undefined {
    const item = this.queue.shift();
    if (item) {
      this.notify();
    }
    return item;
  }

  /** Obtener el primer audio sin removerlo */
  public peek(): AudioItem | undefined {
    return this.queue[0];
  }

  /** Limpiar la cola */
  public clear(): void {
    this.queue = [];
    this.notify();
  }

  /** Obtener copia actual de la cola */
  public getItems(): AudioItem[] {
    return [...this.queue];
  }

  /** Obtener la cantidad de elementos en la cola */
  public get size(): number {
    return this.queue.length;
  }

  /** Suscribirse a cambios en la cola */
  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getItems());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const items = this.getItems();
    this.listeners.forEach((listener) => listener(items));
  }
}

// Instancia singleton por defecto
export const globalAudioQueue = new AudioQueueManager();
