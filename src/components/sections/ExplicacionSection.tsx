'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Bot, Compass, UserCheck } from 'lucide-react';

export default function ExplicacionSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // En caso de que el navegador bloquee el autoplay inicial
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      id="explicacion"
      className="
        snap-start relative flex flex-col justify-between
        h-dvh w-full
        bg-gris-oscuro overflow-hidden
        pt-16 md:pt-20 pb-20 md:pb-8
      "
    >
      {/* ── ÁREA DE VIDEO DE EXTREMO A EXTREMO ── */}
      <div
        onClick={togglePlay}
        className="
          relative w-full flex-1
          bg-gris-surface border-y border-gris-border
          flex items-center justify-center
          overflow-hidden group cursor-pointer
          my-auto
        "
      >
        {/* Elemento de video HTML5 con Autoplay y Mute para permitirlo en navegadores */}
        <video
          ref={videoRef}
          src="/captura-web-ia.mp4"
          autoPlay
          muted
          playsInline
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-contain md:object-cover"
        />

        {/* Overlay con controles y título cuando está pausado o en hover */}
        <div
          className={`
            absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity duration-300
            ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}
          `}
        >
          {/* Botón central Play / Pause */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="
                flex items-center justify-center
                w-16 h-16 md:w-20 md:h-20 rounded-full
                bg-celeste-muted/20 border border-celeste-muted/40 backdrop-blur-sm
                group-hover:bg-celeste-muted/30 group-hover:scale-110 group-hover:border-celeste-muted
                transition-all duration-300 shadow-2xl shadow-celeste-muted/20
              "
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 md:w-8 md:h-8 text-celeste-muted fill-celeste-muted" />
              ) : (
                <Play className="w-7 h-7 md:w-8 md:h-8 text-celeste-muted fill-celeste-muted ml-1" />
              )}
            </div>
            {!isPlaying && (
              <span className="font-space-mono text-xs md:text-sm text-texto-main/90 font-medium tracking-wide drop-shadow-md">
                Ver Demo: Concesionario Inteligente
              </span>
            )}
          </div>
        </div>

        {/* Indicador inferior dentro del video */}
        <p className="absolute bottom-3 left-6 font-space-mono text-[10px] md:text-xs text-texto-sub/80 uppercase tracking-widest pointer-events-none drop-shadow">
          Demo en vivo · Sitio Web + Copiloto IA Autónomo
        </p>
      </div>

      {/* ── RESUMEN DESARROLLADO EN LA PARTE INFERIOR ── */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-4 md:pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start shrink-0">
        
        {/* Pilar 1: Copiloto IA 24/7 */}
        <div className="flex flex-col gap-1.5 border-l border-gris-border/80 pl-4 md:pl-5 hover:border-celeste-muted/60 transition-colors">
          <div className="flex items-center gap-2 text-celeste-muted">
            <Bot className="w-4 h-4 opacity-80 shrink-0" />
            <h3 className="font-space-mono font-bold text-texto-main text-xs sm:text-sm tracking-wide uppercase">
              Copiloto IA 24/7
            </h3>
          </div>
          <p className="font-inter text-texto-sub text-xs leading-relaxed">
            Sitio web + agente inteligente que responde consultas complejas al instante, asesora de forma personalizada y nunca deja a un cliente sin atención.
          </p>
        </div>

        {/* Pilar 2: Navegación Asistida */}
        <div className="flex flex-col gap-1.5 border-l border-gris-border/80 pl-4 md:pl-5 hover:border-amarillo-muted/60 transition-colors">
          <div className="flex items-center gap-2 text-amarillo-muted">
            <Compass className="w-4 h-4 opacity-80 shrink-0" />
            <h3 className="font-space-mono font-bold text-texto-main text-xs sm:text-sm tracking-wide uppercase">
              Navegación Asistida
            </h3>
          </div>
          <p className="font-inter text-texto-sub text-xs leading-relaxed">
            La IA guía activamente al usuario por el sitio, filtrando catálogo, recomendando unidades o secciones según sus necesidades exactas en tiempo real.
          </p>
        </div>

        {/* Pilar 3: Captura y Calificación de Leads */}
        <div className="flex flex-col gap-1.5 border-l border-gris-border/80 pl-4 md:pl-5 hover:border-celeste-muted/60 transition-colors">
          <div className="flex items-center gap-2 text-celeste-muted">
            <UserCheck className="w-4 h-4 opacity-80 shrink-0" />
            <h3 className="font-space-mono font-bold text-texto-main text-xs sm:text-sm tracking-wide uppercase">
              Guarda y Califica Leads
            </h3>
          </div>
          <p className="font-inter text-texto-sub text-xs leading-relaxed">
            Detecta la intención de compra, recolecta datos clave de contacto y califica prospectos listos para tu equipo comercial o integración con CRM privado.
          </p>
        </div>

      </div>
    </section>
  );
}
