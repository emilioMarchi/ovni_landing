'use client';

import { Button } from '@/components/ui/Button';

export default function HeroSection() {
  const handleConversar = () => {
    window.dispatchEvent(
      new CustomEvent('startAgentGreeting', {
        detail: { message: 'Hola' }
      })
    );
  };

  const handleVideo = () => {
    window.dispatchEvent(new CustomEvent('navScrollTo', { detail: { id: 'explicacion' } }));
  };

  const handleContacto = () => {
    window.dispatchEvent(new CustomEvent('navScrollTo', { detail: { id: 'contacto' } }));
  };

  return (
    <section
      id="hero"
      className="
        snap-start relative flex flex-col items-center justify-center
        h-dvh w-full
        bg-gris-oscuro overflow-hidden
        px-6 md:px-16
      "
    >
      {/* Gradiente de fondo sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-celeste-muted/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-amarillo-muted/5 blur-3xl" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl gap-8">

        {/* DESARROLLO DE SOFTWARE & IA A MEDIDA */}
        <p className="font-space-mono text-sm md:text-base lg:text-lg font-bold tracking-[0.25em] uppercase text-celeste-muted">
          DESARROLLO DE SOFTWARE & IA A MEDIDA
        </p>

        {/* Título principal */}
        <h1 className="font-space-mono font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-texto-main">
          Te convenzo en{' '}
          <span className="text-celeste-muted font-medium">3 pasos</span>{' '}
          de integrar IA en tu sitio web y sistemas privados.
        </h1>

        {/* ── ITEMS FLOTANTES SECUENCIALES (Texto solo más grande sin container) ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 my-2">
          
          {/* Item 1: - Conversá con EVA */}
          <button
            onClick={handleConversar}
            style={{ animationDelay: '400ms' }}
            className="
              group flex items-center gap-2
              text-texto-main hover:text-celeste-muted bg-transparent border-none
              font-space-mono text-base md:text-xl lg:text-2xl tracking-wide transition-all duration-300
              animate-fadeIn opacity-0 [animation-fill-mode:forwards] cursor-pointer
            "
          >
            <span className="text-celeste-muted font-bold group-hover:scale-125 transition-transform">-</span>
            <span>Conversá con EVA</span>
          </button>

          {/* Item 2: - Mirá el video */}
          <button
            onClick={handleVideo}
            style={{ animationDelay: '800ms' }}
            className="
              group flex items-center gap-2
              text-texto-main hover:text-amarillo-muted bg-transparent border-none
              font-space-mono text-base md:text-xl lg:text-2xl tracking-wide transition-all duration-300
              animate-fadeIn opacity-0 [animation-fill-mode:forwards] cursor-pointer
            "
          >
            <span className="text-amarillo-muted font-bold group-hover:scale-125 transition-transform">-</span>
            <span>Mirá el video</span>
          </button>

          {/* Item 3: - Contactame */}
          <button
            onClick={handleContacto}
            style={{ animationDelay: '1200ms' }}
            className="
              group flex items-center gap-2
              text-texto-main hover:text-celeste-muted bg-transparent border-none
              font-space-mono text-base md:text-xl lg:text-2xl tracking-wide transition-all duration-300
              animate-fadeIn opacity-0 [animation-fill-mode:forwards] cursor-pointer
            "
          >
            <span className="text-celeste-muted font-bold group-hover:scale-125 transition-transform">-</span>
            <span>Contactame</span>
          </button>

        </div>

        {/* ── ÚNICO CTA: "Empezar" (Aparece al final tras los items) ── */}
        <div
          style={{ animationDelay: '1600ms' }}
          className="animate-fadeIn opacity-0 [animation-fill-mode:forwards] mt-2"
        >
          <Button
            size="lg"
            variant="primary"
            className="font-space-mono text-base md:text-lg px-8 py-4 shadow-xl hover:scale-105 transition-transform"
            onClick={handleConversar}
          >
            Empezar
          </Button>
        </div>

      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 flex flex-col items-center gap-1 animate-bounce">
        <div className="w-px h-8 bg-gradient-to-b from-texto-sub/0 to-texto-sub/50" />
      </div>
    </section>
  );
}
