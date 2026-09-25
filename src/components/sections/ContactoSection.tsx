'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MessageCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useAgentSocket } from '@/hooks/useAgentSocket';

export default function ContactoSection() {
  const [modo, setModo] = useState<'elegir' | 'formulario' | 'chat'>('elegir');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    consulta: '',
  });
  const [enviado, setEnviado] = useState(false);

  const { sendTextMessage } = useAgentSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.consulta) return;

    const promptLead = `[NUEVO LEAD DE FORMULARIO] Nombre: ${formData.nombre}, Email: ${formData.email}, Empresa: ${formData.empresa || 'N/A'}, Consulta: ${formData.consulta}`;
    sendTextMessage(promptLead);

    setEnviado(true);
  };

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
            Hablemos
          </h2>
          <p className="font-inter text-texto-sub text-base md:text-lg max-w-md">
            Contame qué necesitás. Podemos charlar ahora o dejás tus datos y te escribo.
          </p>
        </div>

        {/* ── Selector de modo ── */}
        {modo === 'elegir' && !enviado && (
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setModo('chat');
                const chatBtn = document.querySelector('nav button[title="Abrir Chat"]');
                if (chatBtn) (chatBtn as HTMLButtonElement).click();
              }}
              className="flex items-center gap-2 cursor-pointer font-space-mono"
            >
              <MessageCircle className="w-4 h-4" />
              Hablar con el Agente
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setModo('formulario')}
              className="flex items-center gap-2 cursor-pointer font-space-mono"
            >
              <FileText className="w-4 h-4" />
              Completar Formulario
            </Button>
          </div>
        )}

        {/* ── Formulario desplegable ── */}
        {modo === 'formulario' && !enviado && (
          <form
            onSubmit={handleSubmit}
            className="w-full bg-gris-surface border border-gris-border rounded-2xl p-6 flex flex-col gap-4 text-left animate-fadeIn"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-space-mono text-xs text-texto-sub uppercase tracking-wide">Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="bg-gris-oscuro border border-gris-border rounded-lg px-3 py-2.5 text-sm text-texto-main placeholder:text-texto-sub/50 focus:outline-none focus:border-celeste-muted/60 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-space-mono text-xs text-texto-sub uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gris-oscuro border border-gris-border rounded-lg px-3 py-2.5 text-sm text-texto-main placeholder:text-texto-sub/50 focus:outline-none focus:border-celeste-muted/60 transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-space-mono text-xs text-texto-sub uppercase tracking-wide">Empresa / Proyecto <span className="normal-case opacity-60 font-inter">(opcional)</span></label>
              <input
                type="text"
                placeholder="Nombre de tu empresa o proyecto"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className="bg-gris-oscuro border border-gris-border rounded-lg px-3 py-2.5 text-sm text-texto-main placeholder:text-texto-sub/50 focus:outline-none focus:border-celeste-muted/60 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-space-mono text-xs text-texto-sub uppercase tracking-wide">¿Qué necesitás?</label>
              <textarea
                required
                rows={3}
                placeholder="Contame brevemente qué tipo de sistema o automatización estás buscando..."
                value={formData.consulta}
                onChange={(e) => setFormData({ ...formData, consulta: e.target.value })}
                className="bg-gris-oscuro border border-gris-border rounded-lg px-3 py-2.5 text-sm text-texto-main placeholder:text-texto-sub/50 focus:outline-none focus:border-celeste-muted/60 transition-colors resize-none"
              />
            </div>
            <div className="flex items-center justify-between gap-4 pt-1">
              <button
                type="button"
                onClick={() => setModo('elegir')}
                className="font-space-mono text-xs text-texto-sub hover:text-texto-main transition-colors cursor-pointer"
              >
                ← Volver
              </button>
              <Button type="submit" variant="primary" size="md" className="font-space-mono">
                Enviar consulta
              </Button>
            </div>
          </form>
        )}

        {/* ── Confirmación de envío ── */}
        {enviado && (
          <div className="w-full bg-celeste-muted/10 border border-celeste-muted/30 rounded-2xl p-6 flex flex-col items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-celeste-muted" />
            <p className="font-space-mono font-bold text-texto-main text-xl">¡Consulta recibida!</p>
            <p className="font-inter text-texto-sub text-sm text-center">
              El agente de OVNISTUDIO procesó tus datos. Te responderemos a la brevedad.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEnviado(false);
                setModo('elegir');
              }}
              className="mt-2 font-space-mono"
            >
              Enviar otra consulta
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}
