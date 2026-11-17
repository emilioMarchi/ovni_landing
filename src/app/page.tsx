'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/sections/HeroSection';
import ExplicacionSection from '@/components/sections/ExplicacionSection';
import ResultadosSection from '@/components/sections/ResultadosSection';
import ModeloTrabajoSection from '@/components/sections/ModeloTrabajoSection';
import ContactoSection from '@/components/sections/ContactoSection';

const SECTION_IDS = ['hero', 'explicacion', 'resultados', 'modelo', 'contacto'];

// Configuraciones de iluminación ambiental y color de fondo para cada sección
// (Cambio notorio y distintivo de escenario: azul noche -> negro cine -> cian petróleo -> bronce cálido -> azul grafito)
const AMBIENT_THEMES = [
  // 0: Hero (Azul noche espacial con destellos celestes activos)
  {
    bg: 'bg-[#0c1219]',
    orb1: { top: '20%', left: '25%', size: '600px', color: 'rgba(123, 180, 202, 0.22)', scale: 1 },
    orb2: { top: '75%', left: '75%', size: '500px', color: 'rgba(229, 193, 88, 0.12)', scale: 1 },
  },
  // 1: Explicacion (Negro cinemático de sala de cine con halo centrado tras el video)
  {
    bg: 'bg-[#07090c]',
    orb1: { top: '35%', left: '50%', size: '700px', color: 'rgba(123, 180, 202, 0.15)', scale: 1.15 },
    orb2: { top: '85%', left: '15%', size: '380px', color: 'rgba(229, 193, 88, 0.05)', scale: 0.85 },
  },
  // 2: Resultados (Cian petróleo tecnológico: cambio evidente y fresco para las cards)
  {
    bg: 'bg-[#081822]',
    orb1: { top: '35%', left: '15%', size: '640px', color: 'rgba(123, 180, 202, 0.28)', scale: 1.1 },
    orb2: { top: '65%', left: '85%', size: '480px', color: 'rgba(229, 193, 88, 0.14)', scale: 1 },
  },
  // 3: Modelo de Trabajo (Bronce / carbón cálido: contraste térmico notable hacia el negocio)
  {
    bg: 'bg-[#1a140d]',
    orb1: { top: '70%', left: '15%', size: '450px', color: 'rgba(123, 180, 202, 0.09)', scale: 0.9 },
    orb2: { top: '25%', left: '75%', size: '620px', color: 'rgba(229, 193, 88, 0.26)', scale: 1.2 },
  },
  // 4: Contacto (Azul noche de cierre con convergencia equilibrada en el centro)
  {
    bg: 'bg-[#0b141a]',
    orb1: { top: '42%', left: '32%', size: '540px', color: 'rgba(123, 180, 202, 0.22)', scale: 1 },
    orb2: { top: '48%', left: '68%', size: '520px', color: 'rgba(229, 193, 88, 0.18)', scale: 1 },
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrollingRef = useRef(false);
  const touchStartYRef = useRef(0);

  const currentTheme = AMBIENT_THEMES[currentIndex] || AMBIENT_THEMES[0];

  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= SECTION_IDS.length) return;

    isScrollingRef.current = true;
    setCurrentIndex(index);

    // Período de enfriamiento para evitar saltos acelerados
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  }, []);

  useEffect(() => {
    // ── Interceptar Rueda del Ratón (Wheel) ──
    const handleWheel = (e: WheelEvent) => {
      // Si el evento ocurrió dentro de un modal o elemento con scroll propio (como el Chat)
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-lenis-prevent], .overflow-y-auto, .fixed')) {
        return;
      }

      e.preventDefault();
      if (isScrollingRef.current) return;

      if (e.deltaY > 0) {
        goToSection(currentIndex + 1);
      } else if (e.deltaY < 0) {
        goToSection(currentIndex - 1);
      }
    };

    // ── Interceptar Gestos Táctiles en Móviles (Touch) ──
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-lenis-prevent], .overflow-y-auto, .fixed')) {
        return;
      }
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-lenis-prevent], .overflow-y-auto, .fixed')) {
        return;
      }
      if (isScrollingRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartYRef.current - touchEndY;

      if (Math.abs(diffY) > 35) {
        if (diffY > 0) {
          goToSection(currentIndex + 1);
        } else {
          goToSection(currentIndex - 1);
        }
      }
    };

    // ── Interceptar Teclas de Navegación ──
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (isScrollingRef.current) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToSection(currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToSection(currentIndex - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, goToSection]);

  // Permitir que la NavBar y los botones llamen a la navegación
  useEffect(() => {
    const handleNavScrollTo = (e: CustomEvent<{ id: string }>) => {
      const index = SECTION_IDS.indexOf(e.detail.id);
      if (index !== -1) {
        goToSection(index);
      }
    };

    window.addEventListener('navScrollTo' as any, handleNavScrollTo);
    return () => {
      window.removeEventListener('navScrollTo' as any, handleNavScrollTo);
    };
  }, [goToSection]);

  return (
    <div
      className={`h-dvh w-full overflow-hidden relative transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${currentTheme.bg}`}
    >
      {/* ── Capa de Iluminación Ambiental Dinámica (Cambio sutil y visible de escenario) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Orbe 1 (Celeste Tecnológico) */}
        <div
          className="absolute rounded-full blur-[130px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
          style={{
            top: currentTheme.orb1.top,
            left: currentTheme.orb1.left,
            width: currentTheme.orb1.size,
            height: currentTheme.orb1.size,
            backgroundColor: currentTheme.orb1.color,
            transform: `translate(-50%, -50%) scale(${currentTheme.orb1.scale})`,
          }}
        />

        {/* Orbe 2 (Ámbar Cálido) */}
        <div
          className="absolute rounded-full blur-[130px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
          style={{
            top: currentTheme.orb2.top,
            left: currentTheme.orb2.left,
            width: currentTheme.orb2.size,
            height: currentTheme.orb2.size,
            backgroundColor: currentTheme.orb2.color,
            transform: `translate(-50%, -50%) scale(${currentTheme.orb2.scale})`,
          }}
        />

        {/* Viñeta sutil en los bordes para mayor profundidad */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/25 pointer-events-none" />
      </div>

      {/* Barra de navegación flotante */}
      <NavBar />

      {/* Contenedor deslizante ultrasuave con transform CSS (GPU accelerated) */}
      <main
        className="relative z-10 h-dvh w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(-${currentIndex * 100}dvh)` }}
      >
        <HeroSection />
        <ExplicacionSection />
        <ResultadosSection />
        <ModeloTrabajoSection />
        <ContactoSection />
      </main>
    </div>
  );
}
