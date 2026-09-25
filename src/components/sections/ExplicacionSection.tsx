'use client';

import { Play, Brain, ShieldCheck, Zap } from 'lucide-react';

export default function ExplicacionSection() {
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
      <div className="
        relative w-full flex-1
        bg-gris-surface border-y border-gris-border
        flex items-center justify-center
        overflow-hidden group cursor-pointer
        my-auto
      ">
        {/* Fondo sutil y gradientes de brillo */}
        <div className="absolute inset-0 bg-gradient-to-br from-celeste-muted/10 via-gris-surface to-amarillo-muted/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-celeste-muted/10 blur-3xl pointer-events-none" />

        {/* Botón Play central */}
        <div className="
          relative z-10 flex items-center justify-center
          w-16 h-16 md:w-20 md:h-20 rounded-full
          bg-celeste-muted/20 border border-celeste-muted/40
          group-hover:bg-celeste-muted/30 group-hover:scale-110 group-hover:border-celeste-muted
          transition-all duration-300 shadow-2xl shadow-celeste-muted/20
        ">
          <Play className="w-7 h-7 md:w-8 md:h-8 text-celeste-muted fill-celeste-muted ml-1" />
        </div>

        {/* Indicador inferior dentro del video */}
        <p className="absolute bottom-3 left-6 font-space-mono text-[10px] md:text-xs text-texto-sub/50 uppercase tracking-widest">
          Video Explicativo OVNISTUDIO
        </p>
      </div>

      {/* ── RESUMEN DESARROLLADO EN LA PARTE INFERIOR ── */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-4 md:pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start shrink-0">
        
        {/* Pilar 1: Sistemas Cognitivos */}
        <div className="flex flex-col gap-1.5 border-l border-gris-border/80 pl-4 md:pl-5 hover:border-celeste-muted/60 transition-colors">
          <div className="flex items-center gap-2 text-celeste-muted">
            <Brain className="w-4 h-4 opacity-80 shrink-0" />
            <h3 className="font-space-mono font-bold text-texto-main text-xs sm:text-sm tracking-wide uppercase">
              Sistemas Cognitivos
            </h3>
          </div>
          <p className="font-inter text-texto-sub text-xs leading-relaxed">
            Modelos de IA diseñados para aprender y razonar sobre la lógica de tu negocio, generando bases de conocimiento semánticas con precisión contextual.
          </p>
        </div>

        {/* Pilar 2: Privacidad e IA Local */}
        <div className="flex flex-col gap-1.5 border-l border-gris-border/80 pl-4 md:pl-5 hover:border-amarillo-muted/60 transition-colors">
          <div className="flex items-center gap-2 text-amarillo-muted">
            <ShieldCheck className="w-4 h-4 opacity-80 shrink-0" />
            <h3 className="font-space-mono font-bold text-texto-main text-xs sm:text-sm tracking-wide uppercase">
              IA Local y Privada
            </h3>
          </div>
          <p className="font-inter text-texto-sub text-xs leading-relaxed">
            Infraestructura privada donde tus datos confidenciales permanecen 100% bajo tu control, sin dependencia de terceros ni filtración de información.
          </p>
        </div>

        {/* Pilar 3: Automatización de Flujos */}
        <div className="flex flex-col gap-1.5 border-l border-gris-border/80 pl-4 md:pl-5 hover:border-celeste-muted/60 transition-colors">
          <div className="flex items-center gap-2 text-celeste-muted">
            <Zap className="w-4 h-4 opacity-80 shrink-0" />
            <h3 className="font-space-mono font-bold text-texto-main text-xs sm:text-sm tracking-wide uppercase">
              Flujos Automatizados
            </h3>
          </div>
          <p className="font-inter text-texto-sub text-xs leading-relaxed">
            Agentes autónomos e interfaces interactivas que ejecutan tareas complejas de extremo a extremo, eliminando fricciones operativas en tus procesos.
          </p>
        </div>

      </div>
    </section>
  );
}
