'use client';

import { useCallback } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MessageCircle, Image, Smartphone } from 'lucide-react';

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
        bg-gris-oscuro overflow-hidden
        px-6 md:px-16 py-24
      "
    >
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-celeste-muted/6 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-2xl w-full">

        <div className="flex flex-col items-center gap-3">
          <Badge variant="celeste">Paso 3 de 3</Badge>
          <h2 className="font-space-mono font-bold text-3xl md:text-4xl text-texto-main leading-tight">
            Impulsemos tu proyecto
          </h2>
          <p className="font-inter text-texto-sub text-base md:text-lg max-w-md">
            Desarrollo de software a medida e integracion de IA para sitios web y sistemas privados. Contame tu idea.
          </p>
        </div>

        {/* ── Boton Agente ── */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleAgente}
          className="flex items-center gap-2 cursor-pointer font-space-mono w-full md:w-auto"
        >
          <MessageCircle className="w-4 h-4" />
          Agendar reunion / Consulta
        </Button>

        {/* ── Redes sociales ── */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-6">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer font-space-mono"
          >
            <Button variant="outline" size="lg" className="font-space-mono">
              <Image className="w-4 h-4" />
              Instagram
            </Button>
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MENSAJE_AGENTE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer font-space-mono"
          >
            <Button variant="outline" size="lg" className="font-space-mono">
              <Smartphone className="w-4 h-4" />
              WhatsApp 3425161099
            </Button>
          </a>
        </div>

      </div>
    </section>
  );
}
