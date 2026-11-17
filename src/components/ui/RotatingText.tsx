'use client';

import { useEffect, useState, ReactNode } from 'react';

export type RotatingHeaderItem = {
  title: ReactNode;
  subtitle: ReactNode;
};

export function HighlightText({
  children,
  color = 'celeste',
  variant = 'title',
}: {
  children: ReactNode;
  color?: 'celeste' | 'amarillo';
  variant?: 'title' | 'subtitle';
}) {
  const isTitle = variant === 'title';
  const colorClass =
    color === 'celeste'
      ? 'decoration-celeste-muted/45'
      : 'decoration-amarillo-muted/45';

  return (
    <span
      className={`
        underline
        ${colorClass}
        ${
          isTitle
            ? 'underline-offset-[6px] md:underline-offset-8 decoration-2 sm:decoration-[3px]'
            : 'underline-offset-4 decoration-1 sm:decoration-2 text-texto-main font-medium'
        }
      `}
    >
      {children}
    </span>
  );
}

type RotatingTextProps = {
  items: RotatingHeaderItem[];
  displayDuration?: number; // Tiempo que permanece visible completo (ms)
  className?: string;
};

export default function RotatingText({
  items,
  displayDuration = 3600,
  className = '',
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState<'line1' | 'line2' | 'exit'>('line1');

  useEffect(() => {
    // 1. Mostrar Renglón 1 (Título) de inmediato
    setStage('line1');

    // 2. Mostrar Renglón 2 (Subtítulo) tras un breve retardo para el efecto escalonado renglón por renglón
    const line2Timer = setTimeout(() => {
      setStage('line2');
    }, 380);

    // 3. Salida suave (fade-out)
    const exitTimer = setTimeout(() => {
      setStage('exit');
    }, displayDuration);

    // 4. Pasar al siguiente slide al concluir la transición de salida
    const nextTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setStage('line1');
    }, displayDuration + 420);

    return () => {
      clearTimeout(line2Timer);
      clearTimeout(exitTimer);
      clearTimeout(nextTimer);
    };
  }, [currentIndex, items.length, displayDuration]);

  const currentItem = items[currentIndex];

  const isExit = stage === 'exit';
  const showLine1 = stage === 'line1' || stage === 'line2';
  const showLine2 = stage === 'line2';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* ── Renglón 1: Título Principal ── */}
      <div
        className={`
          transition-all duration-500 ease-out will-change-transform
          ${
            isExit
              ? 'opacity-0 -translate-y-2'
              : showLine1
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }
        `}
      >
        <h1 className="font-space-mono font-bold text-3xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight text-texto-main">
          {currentItem.title}
        </h1>
      </div>

      {/* ── Renglón 2: Subtítulo pequeño debajo ── */}
      <div
        className={`
          transition-all duration-500 ease-out will-change-transform mt-3 md:mt-4 max-w-2xl px-2
          ${
            isExit
              ? 'opacity-0 -translate-y-2'
              : showLine2
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }
        `}
      >
        <p className="font-inter text-sm sm:text-base md:text-lg text-texto-sub leading-relaxed">
          {currentItem.subtitle}
        </p>
      </div>
    </div>
  );
}
