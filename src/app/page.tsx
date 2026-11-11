'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/sections/HeroSection';
import ExplicacionSection from '@/components/sections/ExplicacionSection';
import ContactoSection from '@/components/sections/ContactoSection';

const SECTION_IDS = ['hero', 'explicacion', 'contacto'];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrollingRef = useRef(false);
  const touchStartYRef = useRef(0);

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
    <div className="h-dvh w-full overflow-hidden relative bg-gris-oscuro">
      {/* Barra de navegación flotante */}
      <NavBar />

      {/* Contenedor deslizante ultrasuave con transform CSS (GPU accelerated) */}
      <main
        className="h-dvh w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(-${currentIndex * 100}dvh)` }}
      >
        <HeroSection />
        <ExplicacionSection />
        <ContactoSection />
      </main>
    </div>
  );
}
