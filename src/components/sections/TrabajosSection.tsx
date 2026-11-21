'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Trabajo {
  id: string;
  categoria: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  enlace: string;
  imagenes: string[];
}

const buildImages = (proyecto: string, desde: number, count: number) =>
  Array.from({ length: count }, (_, i) => `/trabajos/${proyecto}/capa-${desde + i}.jpg`);

const TRABAJOS: Trabajo[] = [
  {
    id: 'web-escuelita',
    categoria: 'Sitio institucional',
    titulo: 'Escuela de Música Barrial',
    resumen: 'Sitio institucional con clases, novedades, galería y módulo de donaciones.',
    descripcion:
      'Sitio para la Escuela de Música Barrial con secciones de clases, novedades, galería, formulario de inscripción y módulo de donaciones para sostener el proyecto.',
    enlace: 'https://escuelademusicabarrial.ar',
    imagenes: buildImages('web-escuelita', 1, 8),
  },
  {
    id: 'web-angel',
    categoria: 'Plataforma musical',
    titulo: 'Ángel Giolitti',
    resumen: 'Sitio y plataforma para músico con biblioteca, reproductor y panel de administración.',
    descripcion:
      'Sitio oficial de Ángel Giolitti: biblioteca de álbumes, reproductor, agenda de eventos, galería y un panel privado para gestionar música, proyectos y biografía.',
    enlace: 'https://angelgiolitti.com.ar',
    imagenes: buildImages('web-angel', 9, 13),
  },
];

const ImageRotator = ({
  imagenes,
  titulo,
  activo,
}: {
  imagenes: string[];
  titulo: string;
  activo: boolean;
}) => {
  const [index, setIndex] = useState(0);
  const total = imagenes.length;
  const currentSrc = imagenes[index];

  useEffect(() => {
    if (!activo || total <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 3200);

    return () => clearInterval(timer);
  }, [activo, total]);

  if (!currentSrc) return null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-gris-border bg-gris-surface">
      {imagenes.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{
            opacity: i === index ? 1 : 0,
            transform: i === index ? 'scale(1)' : 'scale(1.03)',
            zIndex: i === index ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt={`${titulo} - captura ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain"
            priority={i === 0}
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-3 pb-2 pt-8">
        <div className="flex items-center gap-1">
          {imagenes.map((_, i) => (
            <span
              key={i}
              className={`h-1 w-1.5 rounded-full transition-colors duration-300 ${
                i === index ? 'bg-celeste-muted' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
        <span className="font-space-mono text-[10px] text-white/90 tabular-nums">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
};

const TrabajoCard = ({
  trabajo,
  numero,
  activo,
}: {
  trabajo: Trabajo;
  numero: number;
  activo: boolean;
}) => {
  const { categoria, titulo, resumen, descripcion, enlace, imagenes } = trabajo;

  return (
    <article className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-2 px-0.5 md:flex-row md:gap-6 md:px-0">
      <div className="flex min-h-0 w-full flex-1 flex-col md:w-2/3">
        <div className="shrink-0 flex items-center justify-between gap-2 px-0.5 pb-1.5 md:pb-2">
          <span className="font-space-mono text-[10px] md:text-xs text-celeste-muted uppercase tracking-wider">
            Proyecto {String(numero).padStart(2, '0')}
          </span>
          <span className="font-space-mono text-[10px] md:text-xs text-texto-sub/70 uppercase tracking-wider">
            {imagenes.length} capturas
          </span>
        </div>

        <div className="flex-1 min-h-0 w-full">
          <ImageRotator
            key={activo ? 'activo' : 'inactivo'}
            imagenes={imagenes}
            titulo={titulo}
            activo={activo}
          />
        </div>
      </div>

      <div className="flex shrink-0 flex-col justify-center md:w-1/3">
        <span className="font-space-mono text-[10px] md:text-xs text-celeste-muted uppercase tracking-wider">
          {categoria}
        </span>
        <h3 className="font-space-mono font-bold text-base md:text-2xl text-texto-main leading-tight mt-0.5">
          {titulo}
        </h3>
        <p className="font-inter text-texto-sub text-[11px] md:text-sm leading-snug mt-1">
          {resumen}
        </p>
        <Link href={enlace} target="_blank" rel="noopener noreferrer" className="mt-3 self-start">
          <Button size="sm" variant="outline" className="font-space-mono text-[11px] md:text-xs whitespace-nowrap">
            Ver sitio <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </Link>
        <p className="font-inter text-texto-sub/90 text-[11px] md:text-sm leading-relaxed mt-3 md:mt-4">
          {descripcion}
        </p>
      </div>
    </article>
  );
};

export default function TrabajosSection() {
  const [index, setIndex] = useState(0);
  const touchStartXRef = useRef(0);
  const total = TRABAJOS.length;

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % total) + total) % total);
    },
    [total]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) goTo(index + 1);
      else goTo(index - 1);
    }
  };

  return (
    <section
      id="trabajos"
      className="
        snap-start relative h-dvh w-full
        bg-transparent overflow-hidden
        flex flex-col
        pt-5 md:pt-24 pb-24 md:pb-8
      "
    >
      <header className="shrink-0 px-4 sm:px-6 md:px-12 text-center mb-2 md:mb-4">
        <span className="font-space-mono text-[11px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-celeste-muted font-bold">
          Trabajos realizados
        </span>
        <h2 className="font-space-mono font-bold text-lg sm:text-xl md:text-3xl leading-tight tracking-tight text-texto-main mt-1">
          Algunos de nuestros proyectos
        </h2>
      </header>

      <div
        className="flex-1 min-h-0 w-full overflow-hidden px-4 sm:px-6 md:px-12"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {TRABAJOS.map((t, i) => (
            <div key={t.id} className="w-full shrink-0 h-full flex justify-center px-1">
              <TrabajoCard trabajo={t} numero={i + 1} activo={index === i} />
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-center gap-3 pt-2 md:pt-3">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Proyecto anterior"
          className="
            p-2 rounded-full
            bg-gris-surface border border-gris-border
            text-texto-sub hover:text-texto-main
            active:scale-95 transition-all
          "
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {TRABAJOS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir al proyecto ${i + 1}`}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${index === i ? 'w-6 bg-celeste-muted' : 'w-2 bg-gris-border hover:bg-texto-sub/40'}
              `}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Siguiente proyecto"
          className="
            p-2 rounded-full
            bg-gris-surface border border-gris-border
            text-texto-sub hover:text-texto-main
            active:scale-95 transition-all
          "
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
