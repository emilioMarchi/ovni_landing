'use client';

import { Bot, Database, Cpu, UserCheck } from 'lucide-react';

export default function ResultadosSection() {
  const casos = [
    {
      title: 'Agente 24/7',
      color: 'celeste',
      icon: 'Bot',
      text: 'Atendés a clientes las 24hs, incluso de noche y fines de semana, sin dejar a nadie sin respuesta.',
    },
    {
      title: 'Base de conocimiento privada',
      color: 'amarillo',
      icon: 'Database',
      text: 'Tu información organizada y disponible al instante, sin depender de terceros ni nubes externas.',
    },
    {
      title: 'IA local en tus sistemas',
      color: 'celeste',
      icon: 'Cpu',
      text: 'Automatizás flujos de trabajo sobre lo que ya usás, sin interrumpir tu operación actual.',
    },
    {
      title: 'Calificación de leads',
      color: 'amarillo',
      icon: 'UserCheck',
      text: 'Detectás quién está listo para comprar, recolectás sus datos y los pasás a tu equipo comercial.',
    },
  ];

  return (
    <section
      id="resultados"
      className="
        snap-start relative flex flex-col items-center justify-start
        min-h-dvh w-full
        bg-gris-oscuro overflow-hidden
        px-6 md:px-12 pt-16 md:pt-24 pb-20
      "
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-celeste-muted/6 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full bg-amarillo-muted/6 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl text-center">
        <div className="flex flex-col items-center gap-4 mb-8 md:mb-12">
          <span className="font-space-mono text-xs md:text-sm tracking-[0.25em] uppercase text-celeste-muted font-bold">
            Qué automatizamos para vos
          </span>
          <h2 className="font-space-mono font-bold text-2xl sm:text-3xl md:text-4xl leading-[1.15] tracking-tight text-texto-main">
            Soluciones listas para integrar
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl mx-auto justify-center">
          {casos.map((c) => (
            <div
              key={c.title}
              className="
                flex flex-col gap-4
                bg-gris-surface border border-gris-border
                rounded-2xl p-6 md:p-8
                hover:border-celeste-muted/50 transition-colors duration-300
                group
                max-w-md mx-auto
              "
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                c.color === 'celeste'
                  ? 'bg-celeste-muted/10 text-celeste-muted border border-celeste-muted/30'
                  : 'bg-amarillo-muted/10 text-amarillo-muted border border-amarillo-muted/30'
              }`}>
                {c.icon === 'Bot' && <Bot className="w-5 h-5" />}
                {c.icon === 'Database' && <Database className="w-5 h-5" />}
                {c.icon === 'Cpu' && <Cpu className="w-5 h-5" />}
                {c.icon === 'UserCheck' && <UserCheck className="w-5 h-5" />}
              </div>

              <h3 className="font-space-mono font-bold text-lg md:text-xl text-texto-main leading-tight">
                {c.title}
              </h3>
              <p className="font-inter text-texto-sub text-sm md:text-base leading-relaxed">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
