'use client';

import { useCallback } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MessageCircle, Smartphone } from 'lucide-react';

const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WHATSAPP_NUMBER = '3425161099';
const INSTAGRAM_URL = 'https://instagram.com/ovnistudio_ar';
const MENSAJE_AGENTE =
  'Hola, me gustaria agendar una reunion o enviar una consulta sobre integracion de IA en mi sitio web y sistemas privados.';

export default function ContactoSection() {
  const handleAgente = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('abrir-chat-agente', {
        detail: { mensaje: MENSAJE_AGENTE },
      })
    );
  }, []);

  return (
    <section
      id="contacto"
      className="
        snap-start relative flex flex-col items-center justify-center
        h-dvh w-full
        bg-transparent overflow-hidden
        px-6 md:px-16 py-24
      "
    >
      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-2xl w-full">

        <div className="flex flex-col items-center gap-3">
          <Badge variant="celeste">Contacto directo</Badge>
          <h2 className="font-space-mono font-bold text-3xl md:text-4xl text-texto-main leading-tight">
            Hablemos de tu proyecto
          </h2>
          <p className="font-inter text-texto-sub text-base md:text-lg max-w-md">
            Desarrollo de software a medida e integración de IA para sitios web y sistemas privados.
          </p>
        </div>

        {/* ── Boton Agente Centrado ── */}
        <div className="w-full flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleAgente}
            className="flex items-center justify-center gap-2 cursor-pointer font-space-mono w-full sm:w-auto max-w-xs shadow-lg hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-4 h-4" />
            Agendar reunion / Consulta
          </Button>
        </div>

        {/* ── Redes sociales centradas en mobile y desktop ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex justify-center"
          >
            <Button
              variant="outline"
              size="lg"
              className="flex items-center justify-center gap-2 font-space-mono w-full sm:w-auto max-w-xs"
            >
              <InstagramIcon className="w-4 h-4" />
              Instagram
            </Button>
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MENSAJE_AGENTE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex justify-center"
          >
            <Button
              variant="outline"
              size="lg"
              className="flex items-center justify-center gap-2 font-space-mono w-full sm:w-auto max-w-xs"
            >
              <Smartphone className="w-4 h-4" />
              WhatsApp 3425161099
            </Button>
          </a>
        </div>

      </div>
    </section>
  );
}
