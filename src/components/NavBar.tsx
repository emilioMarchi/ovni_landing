'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAgentSocket } from '@/hooks/useAgentSocket';
import { AudioWaveform } from '@/components/AudioWaveform';
import { ChatModal } from '@/components/ChatModal';
import {
  Mic,
  MessageSquare,
  MicOff,
  Volume2,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Loader2,
} from 'lucide-react';

type Section = {
  id: string;
  label: string;
};

const SECTIONS: Section[] = [
  { id: 'hero', label: 'Inicio' },
  { id: 'explicacion', label: 'Cómo funciona' },
  { id: 'contacto', label: 'Contacto' },
];

export default function NavBar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados para la viñeta/popup flotante de frases sobre la barra
  const [currentSentence, setCurrentSentence] = useState<string | null>(null);
  const [sentenceIndex, setSentenceIndex] = useState<number>(0);
  const [activeSentences, setActiveSentences] = useState<string[]>([]);

  const {
    isListening,
    volume,
    startListening,
    stopListening,
    queueItems,
    dequeueAudio,
  } = useAudioRecorder();

  const {
    agentStatus,
    setAgentStatus,
    messages,
    sendTextMessage,
    sendAudioChunk,
    backend,
  } = useAgentSocket();

  // Escuchar evento del botón "Empezar" del Hero para enviar mensaje inicial y activar el agente (sin abrir el chat)
  useEffect(() => {
    const handleStartGreeting = (e: CustomEvent<{ message?: string }>) => {
      const initialText = e.detail?.message || 'Hola';
      setAgentStatus('processing');
      sendTextMessage(initialText);
    };

    window.addEventListener('startAgentGreeting' as any, handleStartGreeting);
    return () => {
      window.removeEventListener('startAgentGreeting' as any, handleStartGreeting);
    };
  }, [sendTextMessage, setAgentStatus]);

  // Transmitir fragmentos de audio grabados hacia el backend
  useEffect(() => {
    if (!backend.supportsVoice) return;
    if (queueItems.length > 0) {
      const item = dequeueAudio();
      if (item) {
        setAgentStatus('processing');
        sendAudioChunk(item.id, item.blob);
      }
    }
  }, [queueItems, dequeueAudio, sendAudioChunk, setAgentStatus, backend.supportsVoice]);

  const [lastAgentMsgId, setLastAgentMsgId] = useState<string | null>(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Capturar nuevos mensajes del agente y armar la secuencia de frases
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];

    if (lastMsg.sender === 'agent') {
      const sentencesToPlay =
        lastMsg.sentences && lastMsg.sentences.length > 0
          ? lastMsg.sentences
          : [lastMsg.text];

      if (lastMsg.id !== lastAgentMsgId) {
        setLastAgentMsgId(lastMsg.id);
        setActiveSentences(sentencesToPlay);
        setSentenceIndex(0);
        setCurrentSentence(sentencesToPlay[0]);
      } else {
        setActiveSentences(sentencesToPlay);
        setCurrentSentence(sentencesToPlay[sentenceIndex] || sentencesToPlay[0]);
      }
    }
  }, [messages, lastAgentMsgId, sentenceIndex]);

  // Efecto máquina de escribir (Typewriter / Streaming) para la frase actual
  useEffect(() => {
    if (!currentSentence) {
      setTypewriterText('');
      setIsTyping(false);
      return;
    }

    if (typewriterText === currentSentence) {
      setIsTyping(false);
      return;
    }

    // Si coincide el prefijo, continuar desde donde estaba, de lo contrario reiniciar
    const canResume = currentSentence.startsWith(typewriterText);
    let charIdx = canResume ? typewriterText.length : 0;

    setIsTyping(true);

    const interval = setInterval(() => {
      if (charIdx < currentSentence.length) {
        charIdx++;
        setTypewriterText(currentSentence.slice(0, charIdx));
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [currentSentence, typewriterText]);

  // Temporizador dinámico para pasar a la siguiente frase (solo inicia al terminar de teclear)
  useEffect(() => {
    if (
      activeSentences.length === 0 ||
      sentenceIndex >= activeSentences.length ||
      isTyping ||
      !currentSentence
    ) {
      return;
    }

    const currentText = activeSentences[sentenceIndex] || '';
    const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;
    // Mínimo 2.2s, máximo 8.5s, calculado con 1800ms base + 300ms por palabra
    const durationMs = Math.max(2200, Math.min(8500, 1800 + wordCount * 300));

    const timer = setTimeout(() => {
      if (sentenceIndex + 1 < activeSentences.length) {
        const nextIdx = sentenceIndex + 1;
        setSentenceIndex(nextIdx);
        setCurrentSentence(activeSentences[nextIdx]);
      } else {
        // Al finalizar todas las frases, ocultar el popup flotante
        setCurrentSentence(null);
        setActiveSentences([]);
      }
    }, durationMs);

    return () => clearTimeout(timer);
  }, [sentenceIndex, activeSentences, isTyping, currentSentence]);

  // Observador de intersección para detectar la sección activa
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    window.dispatchEvent(new CustomEvent('navScrollTo', { detail: { id } }));
    setIsMobileMenuOpen(false);
  };

  const handleToggleVoice = () => {
    // La IA local no tiene STT: el microfono no tendria a quien escuchar.
    if (!backend.supportsVoice) {
      setIsChatOpen(true);
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const isAgentActive =
    agentStatus === 'speaking' || agentStatus === 'processing';

  return (
    <>
      {/* ── VIÑETA / POP-UP FLOTANTE DE FRASES (Sobre la barra de navegación) ── */}
      {!isChatOpen && currentSentence && (
        <div
          className="
            fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out
            bottom-20 md:bottom-auto md:top-20
            w-[90%] max-w-lg
            pointer-events-none animate-fadeIn
          "
        >
          <div
            className="
              relative bg-gris-surface/85 backdrop-blur-md border border-celeste-muted/40
              rounded-2xl px-5 py-3.5 shadow-2xl shadow-celeste-muted/10
              flex items-start gap-3 text-texto-main font-inter text-sm md:text-base leading-relaxed
            "
          >
            <div className="w-6 h-6 rounded-full bg-celeste-muted/20 border border-celeste-muted/40 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-celeste-muted animate-pulse" />
            </div>
            
            <div className="flex-1">
              <p className="font-medium text-texto-main">
                {typewriterText}
                <span
                  className={`inline-block w-1.5 h-4 ml-1 bg-celeste-muted align-middle transition-opacity ${
                    isTyping ? 'animate-pulse opacity-100' : 'opacity-0'
                  }`}
                />
              </p>
              
              {activeSentences.length > 1 && (
                <div className="flex items-center gap-1 mt-2">
                  {activeSentences.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === sentenceIndex
                          ? 'w-4 bg-celeste-muted'
                          : 'w-1.5 bg-gris-border/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── BARRA FLOTANTE DE NAVEGACIÓN ── */}
      <nav
        className={`
          fixed z-50 transition-all duration-300 left-1/2 -translate-x-1/2
          flex items-center justify-between
          bg-gris-surface/90 backdrop-blur-md
          border border-gris-border
          rounded-full px-4 py-2 shadow-2xl
          w-[92%] max-w-4xl min-h-[52px]
          bottom-4 md:bottom-auto md:top-4
          ${
            isAgentActive || isListening
              ? 'ring-2 ring-celeste-muted/40'
              : ''
          }
        `}
      >
        {/* ── LADO IZQUIERDO: Logo & Secciones Desktop ── */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            title="Ir al inicio"
          >
            <Image
              src="/logo.png"
              alt="OVNISTUDIO logo"
              width={28}
              height={28}
              className="rounded-md opacity-90"
            />
          </button>

          {/* Enlaces de secciones (Solo Desktop) */}
          <div className="hidden md:flex items-center gap-1 border-l border-gris-border pl-3">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer font-space-mono whitespace-nowrap
                  ${
                    activeSection === id
                      ? 'bg-gris-border/80 text-texto-main font-semibold'
                      : 'text-texto-sub hover:text-texto-main hover:bg-gris-border/40'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTRO EXACTO: Agente Conversacional ── */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center max-w-[160px] sm:max-w-[220px] md:max-w-[260px] pointer-events-auto z-10">
          {!isListening && !isAgentActive ? (
            /* Estado Inactivo: Botón Círculo Celeste Outline */
            <button
              onClick={handleToggleVoice}
              className="
                group flex items-center justify-center gap-2
                h-10 px-3 sm:px-4 rounded-full
                border border-celeste-muted text-celeste-muted bg-transparent
                hover:bg-celeste-muted/10 hover:shadow-lg hover:shadow-celeste-muted/10
                transition-all duration-200 cursor-pointer font-normal text-xs md:text-sm font-space-mono
                max-w-full overflow-hidden
              "
              title={
                backend.supportsVoice
                  ? 'Iniciar conversación por voz'
                  : 'La IA local no procesa audio. Abrir chat de texto.'
              }
            >
              <div className="w-5 h-5 rounded-full border border-celeste-muted flex items-center justify-center shrink-0">
                <Mic className="w-3 h-3 text-celeste-muted block" />
              </div>
              <span className="hidden sm:inline tracking-wider uppercase leading-none truncate font-normal">
                Conversar
              </span>
            </button>
          ) : isListening && !isAgentActive ? (
            /* Estado Grabando / Escuchando Micrófono */
            <button
              onClick={handleToggleVoice}
              className="
                flex items-center justify-center gap-1.5 sm:gap-2
                h-10 px-3 sm:px-4 rounded-full
                bg-celeste-muted text-gris-oscuro font-normal
                border border-celeste-muted
                shadow-lg shadow-celeste-muted/20
                animate-pulse cursor-pointer text-xs md:text-sm font-space-mono
                max-w-full overflow-hidden
              "
              title="Grabando micrófono... Clic para detener"
            >
              <div
                style={{
                  transform: `scale(${1 + Math.min(volume * 3, 0.5)})`,
                }}
                className="w-5 h-5 rounded-full bg-gris-oscuro flex items-center justify-center shrink-0 transition-transform duration-75"
              >
                <Mic className="w-3 h-3 text-celeste-muted block" />
              </div>
              <span className="tracking-wider uppercase leading-none truncate max-w-[90px] sm:max-w-none font-normal">
                Grabando...
              </span>
              <MicOff className="w-3.5 h-3.5 opacity-70 shrink-0 hidden sm:inline" />
            </button>
          ) : (
            /* Estado Agente Procesando o Respondiendo */
            <div className="flex items-center justify-center gap-2 h-10 px-3.5 sm:px-4 rounded-full bg-celeste-muted text-gris-oscuro border border-celeste-muted shadow-lg shadow-celeste-muted/20 font-space-mono max-w-full">
              <Loader2 className="w-4 h-4 animate-spin text-gris-oscuro shrink-0" />
              <span className="tracking-wider uppercase text-xs sm:text-sm font-normal truncate">
                {agentStatus === 'processing' ? 'Procesando' : 'Respondiendo'}
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-gris-oscuro animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 rounded-full bg-gris-oscuro animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 rounded-full bg-gris-oscuro animate-bounce" />
              </span>
            </div>
          )}
        </div>

        {/* ── LADO DERECHO: Chat & Menú ── */}
        <div className="flex items-center gap-1.5 shrink-0 z-10">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`
              p-2 rounded-full transition-colors cursor-pointer flex items-center justify-center
              ${
                isChatOpen
                  ? 'bg-celeste-muted text-gris-oscuro'
                  : 'text-texto-sub hover:text-texto-main hover:bg-gris-border/50'
              }
            `}
            title="Abrir Chat"
          >
            <MessageSquare className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="
              md:hidden p-2 rounded-full text-texto-sub hover:text-texto-main hover:bg-gris-border/50
              transition-colors cursor-pointer border border-gris-border/60 flex items-center justify-center
            "
            aria-label="Abrir menú de navegación"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-celeste-muted" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* ── MENÚ NAVEGACIÓN DESPLEGABLE MOBILE ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/70 backdrop-blur-md flex flex-col justify-end p-4 pb-20 animate-fadeIn">
          <div className="bg-gris-surface border border-gris-border rounded-2xl p-4 flex flex-col gap-2 shadow-2xl">
            <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-gris-border pb-2">
              <span className="font-space-mono text-texto-sub text-xs tracking-widest uppercase">
                Navegación
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-texto-sub hover:text-texto-main text-xs font-space-mono cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>

            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`
                  flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left cursor-pointer font-space-mono
                  ${
                    activeSection === id
                      ? 'bg-celeste-muted/15 text-celeste-muted font-semibold border border-celeste-muted/30'
                      : 'text-texto-main hover:bg-gris-border/40'
                  }
                `}
              >
                <span>{label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ventana Modal de Chat */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSendMessage={sendTextMessage}
        agentStatus={agentStatus}
      />
    </>
  );
}
