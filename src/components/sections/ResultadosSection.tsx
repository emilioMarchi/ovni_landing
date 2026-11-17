'use client';

import { Globe, Bot, Server } from 'lucide-react';
import CardSlider from '@/components/ui/CardSlider';

export default function ResultadosSection() {
  const soluciones = [
    {
      title: 'Web Inteligente',
      color: 'celeste',
      icon: 'Globe',
      items: [
        'Responde consultas complejas 24/7.',
        'Navega y guía al usuario filtrando catálogo en tiempo real.',
        'Detecta intención de compra y guarda leads calificados.',
      ],
    },
    {
      title: 'Agente Integrado',
      color: 'amarillo',
      icon: 'Bot',
      items: [
        'Se conecta de forma directa con la información de tu proyecto.',
        'Entrenado con tus datos, catálogo y reglas de atención.',
        'Deriva prospectos a tu WhatsApp o se integra a tu CRM.',
      ],
    },
    {
      title: 'Sistemas Híbridos',
      color: 'celeste',
      icon: 'Server',
      items: [
        'Servidor en la nube o montado en tu servidor local.',
        'IA en la nube o ejecutada 100% local en tu propio hardware.',
        'Privacidad absoluta de datos y operación continua.',
      ],
    },
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      case 'Server':
        return <Server className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <section
      id="resultados"
      className="
        snap-start relative flex flex-col items-center justify-center
        h-dvh w-full
        bg-gris-oscuro overflow-hidden
        px-4 sm:px-6 md:px-12 pt-14 md:pt-20 pb-8 md:pb-12
      "
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-celeste-muted/6 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full bg-amarillo-muted/6 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl text-center flex flex-col items-center">
        {/* Encabezado */}
        <div className="flex flex-col items-center gap-2 md:gap-4 mb-4 md:mb-10">
          <span className="font-space-mono text-[11px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-celeste-muted font-bold">
            Sistemas y automatizaciones
          </span>
          <h2 className="font-space-mono font-bold text-xl sm:text-2xl md:text-4xl leading-tight tracking-tight text-texto-main">
            Soluciones listas para integrar
          </h2>
        </div>

        {/* ── Vista Mobile: Slider rotativo (3 cards alineadas) ── */}
        <div className="block md:hidden w-full max-w-sm mx-auto">
          <CardSlider autoPlayInterval={4000} accentColor="celeste">
            {soluciones.map((c) => (
              <div
                key={c.title}
                className="
                  flex flex-col gap-3
                  bg-gris-surface border border-gris-border
                  rounded-2xl p-5 sm:p-6
                  text-left min-h-[220px]
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      c.color === 'celeste'
                        ? 'bg-celeste-muted/10 text-celeste-muted border border-celeste-muted/30'
                        : 'bg-amarillo-muted/10 text-amarillo-muted border border-amarillo-muted/30'
                    }`}
                  >
                    {renderIcon(c.icon)}
                  </div>
                  <h3 className="font-space-mono font-bold text-base sm:text-lg text-texto-main leading-snug">
                    {c.title}
                  </h3>
                </div>

                <ul className="flex flex-col gap-2 mt-1">
                  {c.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-texto-sub text-xs sm:text-sm font-inter leading-relaxed"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          c.color === 'celeste' ? 'bg-celeste-muted/70' : 'bg-amarillo-muted/70'
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardSlider>
        </div>

        {/* ── Vista Desktop: Grid clásico de 3 columnas ── */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl mx-auto justify-center">
          {soluciones.map((c) => (
            <div
              key={c.title}
              className="
                flex flex-col gap-4 text-left
                bg-gris-surface border border-gris-border
                rounded-2xl p-6 md:p-8
                hover:border-celeste-muted/50 transition-colors duration-300
                group w-full
              "
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  c.color === 'celeste'
                    ? 'bg-celeste-muted/10 text-celeste-muted border border-celeste-muted/30'
                    : 'bg-amarillo-muted/10 text-amarillo-muted border border-amarillo-muted/30'
                }`}
              >
                {renderIcon(c.icon)}
              </div>

              <h3 className="font-space-mono font-bold text-lg md:text-xl text-texto-main leading-tight">
                {c.title}
              </h3>

              <ul className="flex flex-col gap-2.5 mt-1">
                {c.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-texto-sub text-xs sm:text-sm font-inter leading-relaxed"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        c.color === 'celeste' ? 'bg-celeste-muted/70' : 'bg-amarillo-muted/70'
                      }`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
