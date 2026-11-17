'use client';

import { useRef, useEffect } from 'react';
import { Bot, Compass, UserCheck } from 'lucide-react';

export default function ExplicacionSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasWatched10sRef = useRef(false);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const videoEl = videoRef.current;
    if (!sectionEl || !videoEl) return;

    // Registrar si el usuario ya vio más de 10 segundos del video
    const handleTimeUpdate = () => {
      if (videoEl.currentTime >= 10) {
        hasWatched10sRef.current = true;
      }
    };

    videoEl.addEventListener('timeupdate', handleTimeUpdate);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Si todavía no vio al menos 10 segundos, se reinicia al principio;
          // si ya vio más de 10 segundos, continúa desde donde quedó sin resetear.
          if (!hasWatched10sRef.current) {
            videoEl.currentTime = 0;
          }
          videoEl.play().catch(() => {
            // Autoplay permitido en videos muted
          });
        } else {
          // Pausar cuando la sección sale de la pantalla
          videoEl.pause();
        }
      },
      {
        threshold: 0.25, // Se activa cuando al menos el 25% de la sección es visible
      }
    );

    observer.observe(sectionEl);

    return () => {
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="explicacion"
      className="
        snap-start relative flex flex-col justify-between
        h-dvh w-full
        bg-transparent overflow-hidden
        pt-16 md:pt-20 pb-20 md:pb-8
      "
    >
      {/* ── ÁREA DE VIDEO DE EXTREMO A EXTREMO ── */}
      <div
        className="
          relative w-full flex-1
          bg-gris-surface border-y border-gris-border
          flex items-center justify-center
          overflow-hidden
          my-auto
        "
      >
        {/* Elemento de video HTML5 reproducido automáticamente al visualizarse */}
        <video
          ref={videoRef}
          src="/captura-web-ia.mp4"
          muted
          playsInline
          loop
          preload="none"
          className="max-w-full max-h-full"
        />

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
