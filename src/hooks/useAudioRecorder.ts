'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { VoiceActivityDetector } from '@/lib/audio/vad';
import { globalAudioQueue, AudioItem } from '@/lib/audio/audioQueue';

export interface UseAudioRecorderOptions {
  silenceDurationMs?: number;
  silenceThreshold?: number;
  onAudioRecorded?: (item: AudioItem) => void;
}

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [queueItems, setQueueItems] = useState<AudioItem[]>([]);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const vadRef = useRef<VoiceActivityDetector | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordStartTimeRef = useRef<number>(0);

  // Suscribirse a la cola global de audios
  useEffect(() => {
    const unsubscribe = globalAudioQueue.subscribe((items) => {
      setQueueItems(items);
    });
    return unsubscribe;
  }, []);

  const startRecordingChunk = useCallback(() => {
    if (!mediaStreamRef.current) return;

    audioChunksRef.current = [];
    recordStartTimeRef.current = Date.now();

    try {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const duration = Date.now() - recordStartTimeRef.current;
          
          // Descartar si el blob es minúsculo (<1KB) o la grabación duró menos de 250ms (sin voz o click accidental)
          if (audioBlob.size >= 1024 && duration >= 250) {
            const item = globalAudioQueue.enqueue(audioBlob, duration);
            if (options.onAudioRecorded) {
              options.onAudioRecorded(item);
            }
          } else {
            console.log('[useAudioRecorder] Audio descartado: demasiado corto o sin contenido utilizable', {
              size: audioBlob.size,
              duration,
            });
          }
        }
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsSpeaking(true);
    } catch (err) {
      console.error('Error al iniciar MediaRecorder:', err);
    }
  }, [options]);

  const stopRecordingChunk = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsSpeaking(false);
  }, []);

  // Variable estática o ref para mantener el stream de micrófono activo entre sesiones
  const persistentStreamRef = useRef<MediaStream | null>(null);

  const startListening = useCallback(async () => {
    setError(null);
    try {
      let stream = persistentStreamRef.current;

      // Verificar si existe un stream activo previo
      if (!stream || stream.getAudioTracks().every(track => track.readyState === 'ended')) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        persistentStreamRef.current = stream;
      }

      mediaStreamRef.current = stream;
      setHasPermission(true);

      // Iniciar la grabación con el click del usuario
      startRecordingChunk();
      setIsListening(true);
    } catch (err: unknown) {
      console.error('Error de acceso al micrófono:', err);
      setHasPermission(false);
      setError(
        err instanceof Error ? err.message : 'No se pudo acceder al micrófono.'
      );
      setIsListening(false);
    }
  }, [startRecordingChunk]);

  const stopListening = useCallback(() => {
    // Detener la grabación al hacer click nuevamente
    stopRecordingChunk();

    mediaStreamRef.current = null;
    setIsListening(false);
    setIsSpeaking(false);
    setVolume(0);
  }, [stopRecordingChunk]);

  // Cleanup únicamente cuando el componente se desmonte por completo
  useEffect(() => {
    return () => {
      stopListening();
      if (persistentStreamRef.current) {
        persistentStreamRef.current.getTracks().forEach((track) => track.stop());
        persistentStreamRef.current = null;
      }
    };
  }, [stopListening]);

  return {
    isListening,
    isSpeaking,
    volume,
    hasPermission,
    error,
    queueItems,
    startListening,
    stopListening,
    dequeueAudio: () => globalAudioQueue.dequeue(),
    clearQueue: () => globalAudioQueue.clear(),
  };
}
