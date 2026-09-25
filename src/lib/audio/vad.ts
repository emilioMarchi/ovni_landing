/**
 * Detección de Actividad de Voz (VAD) basada en Web Audio API y AnalyserNode.
 */

export interface VADConfig {
  /** Umbral de volumen RMS para considerar que el usuario habla (0.0 a 1.0) */
  silenceThreshold?: number;
  /** Duración del silencio continuo en ms para considerar fin de frase (ej: 1200ms) */
  silenceDurationMs?: number;
  /** Callback ejecutado cuando se detecta inicio de habla */
  onSpeechStart?: () => void;
  /** Callback ejecutado cuando se detecta fin de habla (pausa) */
  onSpeechEnd?: () => void;
  /** Callback con el nivel actual de audio (0.0 a 1.0) */
  onVolumeChange?: (volume: number) => void;
}

export class VoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private silenceTimer: NodeJS.Timeout | null = null;
  private isSpeaking = false;

  private silenceThreshold: number;
  private silenceDurationMs: number;
  private onSpeechStart?: () => void;
  private onSpeechEnd?: () => void;
  private onVolumeChange?: (volume: number) => void;

  constructor(config: VADConfig = {}) {
    this.silenceThreshold = config.silenceThreshold ?? 0.02;
    this.silenceDurationMs = config.silenceDurationMs ?? 1200;
    this.onSpeechStart = config.onSpeechStart;
    this.onSpeechEnd = config.onSpeechEnd;
    this.onVolumeChange = config.onVolumeChange;
  }

  public async start(stream: MediaStream): Promise<void> {
    this.microphoneStream = stream;
    this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.4;

    this.source = this.audioContext.createMediaStreamSource(stream);
    this.source.connect(this.analyser);

    this.isSpeaking = false;
    this.loop();
  }

  private loop = (): void => {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Calcular nivel de volumen RMS normalizado (0 a 1)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length) / 255;

    if (this.onVolumeChange) {
      this.onVolumeChange(rms);
    }

    if (rms > this.silenceThreshold) {
      // El usuario está hablando
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }

      if (!this.isSpeaking) {
        this.isSpeaking = true;
        if (this.onSpeechStart) {
          this.onSpeechStart();
        }
      }
    } else {
      // El volumen está por debajo del umbral (silencio)
      if (this.isSpeaking && !this.silenceTimer) {
        this.silenceTimer = setTimeout(() => {
          this.isSpeaking = false;
          this.silenceTimer = null;
          if (this.onSpeechEnd) {
            this.onSpeechEnd();
          }
        }, this.silenceDurationMs);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.isSpeaking = false;
  }
}
