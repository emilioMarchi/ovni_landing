'use client';

export default function ModeloTrabajoSection() {
  const pilares = [
    {
      title: 'Setup Inicial',
      color: 'celeste',
      texto:
        'Configuración, integración técnica y entrenamiento del agente con el catálogo y datos de tu negocio. Pago único para poner el sistema en marcha.',
    },
    {
      title: 'Fee Mensual',
      color: 'amarillo',
      texto:
        'Cobertura de servidores, soporte técnico, auditoría de respuestas y ajustes continuos para que tu agente siga funcionando sin interrupciones.',
    },
    {
      title: 'Acompañamiento Constante',
      color: 'celeste',
      texto:
        'Garantía de disponibilidad, actualización de modelos y optimización continua de conversión. Mantenimiento y evolución de tu sistema cognitivo a medida que crece.',
    },
  ];

  return (
    <section
      id="modelo"
      className="
        snap-start relative flex flex-col items-center justify-center
        h-dvh w-full
        bg-gris-oscuro overflow-hidden
        px-6 md:px-12 py-16 md:py-24
      "
    >
      <div className="relative z-10 w-full max-w-5xl text-center">
        <h2 className="font-space-mono font-bold text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight text-texto-main mb-12">
          Nuestro esquema de trabajo
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {pilares.map((p) => (
            <div
              key={p.title}
              className="
                flex flex-col gap-4
                bg-gris-surface border border-gris-border
                rounded-2xl p-8
              "
            >
              <h3 className={`font-space-mono font-bold text-xl md:text-2xl text-texto-main ${
                p.color === 'celeste' ? 'text-celeste-muted' : 'text-amarillo-muted'
              }`}>
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
