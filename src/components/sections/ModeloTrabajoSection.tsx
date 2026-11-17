'use client';

import CardSlider from '@/components/ui/CardSlider';

export default function ModeloTrabajoSection() {
  const pilares = [
    {
      title: 'Desarrollo y Setup Inicial',
      color: 'celeste',
      texto:
        'Desarrollo del sitio web o sistema a medida, configuración técnica y entrenamiento del agente con los datos y catálogo de tu negocio. Pago único de puesta en marcha.',
    },
    {
      title: 'Fee Mensual',
      color: 'amarillo',
      texto:
        'Cobertura de servidores, soporte técnico directo, auditoría de respuestas y ajustes continuos para que tu sistema opere sin interrupciones.',
    },
    {
      title: 'Mantenimiento y Soporte',
      color: 'celeste',
      texto:
        'Supervisión técnica, actualización de modelos y mejoras continuas según los requerimientos de tu operación.',
    },
  ];

  return (
    <section
      id="modelo"
      className="
        snap-start relative flex flex-col items-center justify-center
        h-dvh w-full
        bg-gris-oscuro overflow-hidden
        px-4 sm:px-6 md:px-12 pt-14 md:pt-20 pb-8 md:pb-12
      "
    >
      <div className="relative z-10 w-full max-w-5xl text-center flex flex-col items-center">
        <h2 className="font-space-mono font-bold text-2xl sm:text-3xl md:text-5xl leading-tight tracking-tight text-texto-main mb-6 md:mb-12">
          Esquema de trabajo
        </h2>

        {/* ── Vista Mobile: Slider rotativo ── */}
        <div className="block md:hidden w-full max-w-sm mx-auto">
          <CardSlider autoPlayInterval={4500} accentColor="amarillo">
            {pilares.map((p) => (
              <div
                key={p.title}
                className="
                  flex flex-col gap-3 text-left
                  bg-gris-surface border border-gris-border
                  rounded-2xl p-5 sm:p-6
                "
              >
                <h3
                  className={`font-space-mono font-bold text-lg sm:text-xl ${
                    p.color === 'celeste' ? 'text-celeste-muted' : 'text-amarillo-muted'
                  }`}
                >
                  {p.title}
                </h3>
                <p className="font-inter text-texto-sub text-xs sm:text-sm leading-relaxed">
                  {p.texto}
                </p>
              </div>
            ))}
          </CardSlider>
        </div>

        {/* ── Vista Desktop: Grid clásico de 3 columnas ── */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8 w-full text-left">
          {pilares.map((p) => (
            <div
              key={p.title}
              className="
                flex flex-col gap-4
                bg-gris-surface border border-gris-border
                rounded-2xl p-8
              "
            >
              <h3
                className={`font-space-mono font-bold text-xl md:text-2xl ${
                  p.color === 'celeste' ? 'text-celeste-muted' : 'text-amarillo-muted'
                }`}
              >
                {p.title}
              </h3>
              <p className="font-inter text-texto-sub text-sm md:text-base leading-relaxed">
                {p.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
