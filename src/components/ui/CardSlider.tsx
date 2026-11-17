'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardSliderProps {
  children: React.ReactNode[];
  autoPlayInterval?: number; // en ms, por defecto 4000
  accentColor?: 'celeste' | 'amarillo';
  className?: string;
}

export default function CardSlider({
  children,
  autoPlayInterval = 4000,
  accentColor = 'celeste',
  className = '',
}: CardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isSwipingRef = useRef(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const total = children.length;

  const goTo = useCallback(
    (index: number) => {
      let nextIdx = index;
      if (nextIdx < 0) nextIdx = total - 1;
      if (nextIdx >= total) nextIdx = 0;
      setCurrentIndex(nextIdx);
    },
    [total]
  );

  const handleNext = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const handlePrev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  // Pausa temporal cuando el usuario interactúa (ej. 6 segundos)
  const triggerTemporaryPause = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 6000);
  }, []);

  // Autoplay rotativo
  useEffect(() => {
    if (isPaused || total <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, total, autoPlayInterval]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  // ── Gestos táctiles (Swipe Horizontal) ──
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwipingRef.current) return;
    isSwipingRef.current = false;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartXRef.current - touchEndX;
    const diffY = touchStartYRef.current - touchEndY;

    // Solo si el deslizamiento fue principalmente horizontal y superó 35px
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      triggerTemporaryPause();
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const activeDotClass =
    accentColor === 'celeste' ? 'bg-celeste-muted w-6' : 'bg-amarillo-muted w-6';

  return (
    <div
      className={`relative w-full flex flex-col items-center select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Contenedor del Carrusel (View Window) */}
      <div
        className="w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="w-full shrink-0 flex justify-center px-1"
            >
              <div className="w-full max-w-sm">{child}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles: Flechas e Indicadores (Dots) */}
      <div className="flex items-center justify-between w-full max-w-sm px-2 mt-4">
        {/* Botón Anterior */}
        <button
          type="button"
          onClick={() => {
            triggerTemporaryPause();
            handlePrev();
          }}
          aria-label="Tarjeta anterior"
          className="
            p-2 rounded-full
            bg-gris-surface border border-gris-border
            text-texto-sub hover:text-texto-main
            active:scale-95 transition-all
          "
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Indicadores / Dots */}
        <div className="flex items-center gap-1.5">
          {children.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                triggerTemporaryPause();
                goTo(index);
              }}
              aria-label={`Ir a tarjeta ${index + 1}`}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${currentIndex === index ? activeDotClass : 'w-2 bg-gris-border hover:bg-texto-sub/40'}
              `}
            />
          ))}
        </div>

        {/* Botón Siguiente */}
        <button
          type="button"
          onClick={() => {
            triggerTemporaryPause();
            handleNext();
          }}
          aria-label="Siguiente tarjeta"
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
    </div>
  );
}
