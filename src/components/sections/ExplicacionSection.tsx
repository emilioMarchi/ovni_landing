'use client';

import { useRef, useEffect } from 'react';
import { Bot, Compass, UserCheck } from 'lucide-react';

export default function ExplicacionSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // En caso de que el navegador bloquee el autoplay inicial
      });
    }
  }, []);

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
        className="
          relative w-full flex-1
          bg-gris-surface border-y border-gris-border
          flex items-center justify-center
          overflow-hidden
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
