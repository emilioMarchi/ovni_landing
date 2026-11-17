'use client';

import { Button } from '@/components/ui/Button';
import RotatingText, { RotatingHeaderItem, HighlightText } from '@/components/ui/RotatingText';

const HERO_ITEMS: RotatingHeaderItem[] = [
  {
    title: (
      <>
        WEB <HighlightText color="celeste">INTELIGENTE</HighlightText>
      </>
    ),
    subtitle: (
      <>
        Responde <HighlightText color="celeste" variant="subtitle">24/7</HighlightText>, navega{' '}
        <HighlightText color="celeste" variant="subtitle">automáticamente</HighlightText>, guarda{' '}
        <HighlightText color="celeste" variant="subtitle">leads calificados</HighlightText>
      </>
    ),
  },
  {
    title: (
      <>
        AGENTE <HighlightText color="amarillo">IA INTEGRADO</HighlightText>
      </>
    ),
    subtitle: (
      <>
        Se conecta con la <HighlightText color="amarillo" variant="subtitle">info de tu proyecto</HighlightText>
      </>
    ),
  },
  {
    title: (
      <>
        SISTEMAS <HighlightText color="celeste">HÍBRIDOS</HighlightText>
      </>
    ),
    subtitle: (
      <>
        Servidor en la <HighlightText color="celeste" variant="subtitle">nube o local</HighlightText>, IA en la{' '}
        <HighlightText color="celeste" variant="subtitle">nube o local</HighlightText>
      </>
    ),
  },
];

export default function HeroSection() {
  const handleConversar = () => {
    window.dispatchEvent(
      new CustomEvent('startAgentGreeting', {
        detail: { message: 'Hola, me gustaría saber más sobre la integración de IA en mi negocio' }
      })
    );
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
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl gap-6 md:gap-8">

        {/* Título rotativo renglón por renglón con subtítulo */}
        <div className="w-full min-h-[7.5rem] sm:min-h-[9rem] md:min-h-[10rem] flex items-center justify-center text-center">
          <RotatingText
            items={HERO_ITEMS}
            displayDuration={3800}
            className="w-full"
          />
        </div>

        {/* ── ÚNICO CTA: "Contactar a Eva" ── */}
        <div className="mt-2 md:mt-4">
          <Button
            size="lg"
            variant="primary"
            className="font-space-mono text-base md:text-lg px-8 py-4 shadow-xl hover:scale-105 transition-transform"
            onClick={handleConversar}
          >
            Contactar a Eva
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
