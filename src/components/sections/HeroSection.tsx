'use client';

import { Button } from '@/components/ui/Button';
import RotatingText from '@/components/ui/RotatingText';

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
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl gap-8">

        {/* Título rotativo: soluciones / dolor */}
        <div className="w-full min-h-[6rem] md:min-h-[8rem] flex items-center justify-center text-center">
          <RotatingText
            phrases={[
              'Transformá la fricción operativa de tu negocio en sistemas autónomos y rentables.',
              'Convertí tu tráfico en agenda con un calificador de leads 24/7.',
              'Eliminá los leads fríos. Que tu sistema venda mientras dormís.',
              'Llevá IA autónoma a tu proyecto: concesionarias, clínicas o inmobiliarias.',
              'Entrená una IA con tu negocio. Setup inicial + fee mensual.',
            ]}
            className="w-full font-space-mono font-normal text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-texto-main break-words"
            writeSpeed={45}
            pauseBetween={2200}
            showCursor
          />
        </div>

        {/* ── ÚNICO CTA: "Contactar a Eva" ── */}
        <div
          style={{ animationDelay: '1600ms' }}
          className="animate-fadeIn opacity-0 [animation-fill-mode:forwards] mt-8"
        >
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
