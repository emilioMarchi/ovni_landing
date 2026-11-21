'use client';

import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import Script from 'next/script';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

type Publicacion = {
  url: string;
  aspect: string;
};

const PUBLICACIONES_INSTAGRAM: Publicacion[] = [
  { url: 'https://www.instagram.com/p/Df9k8EfNcf7/', aspect: '4 / 5' },
  { url: 'https://www.instagram.com/p/DfmiTULIBIO/', aspect: '4 / 5' },
  { url: 'https://www.instagram.com/p/Dfagi2TNJai/', aspect: '4 / 5' },
];

type InstagramGlobal = Window & {
  instgrm?: {
    Embeds?: {
      process?: () => void;
    };
  };
};

export default function InstagramSection() {
  const [index, setIndex] = useState(0);

  const processEmbeds = useCallback(() => {
    const instgrm = (window as InstagramGlobal).instgrm;
    instgrm?.Embeds?.process?.();
  }, []);

  useEffect(() => {
    processEmbeds();
  }, [processEmbeds]);

  const mover = (direccion: number) => {
    setIndex((actual) => (actual + direccion + PUBLICACIONES_INSTAGRAM.length) % PUBLICACIONES_INSTAGRAM.length);
  };

  return (
    <section
      id="instagram"
      className="
        snap-start relative h-dvh w-full
        bg-transparent overflow-hidden
        flex flex-col
        pt-5 md:pt-24 pb-24 md:pb-8
      "
    >
      <header className="shrink-0 px-4 sm:px-6 md:px-12 text-center mb-2 md:mb-4">
        <span className="font-space-mono text-[11px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-celeste-muted font-bold">
          Instagram
        </span>
        <h2 className="font-space-mono font-bold text-lg sm:text-xl md:text-3xl leading-tight tracking-tight text-texto-main mt-1">
          @ovnistudio_ar
        </h2>
      </header>

      <div className="flex-1 min-h-0 w-full overflow-hidden md:overflow-x-auto md:overflow-y-auto md:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="mx-auto flex h-full w-full items-center [transform:translateX(calc(var(--indice)_*_-100%))] transition-transform duration-500 ease-out md:w-max md:justify-center md:gap-6 md:!transform-none"
          style={{ '--indice': index } as CSSProperties}
        >
          {PUBLICACIONES_INSTAGRAM.map(({ url, aspect }) => (
            <div key={url} className="flex h-full w-full shrink-0 items-center justify-center px-4 sm:px-6 md:w-[360px] md:px-0">
              <div className="w-full max-w-[360px]">
                <div className="overflow-hidden rounded-2xl border border-gris-border bg-black shadow-lg shadow-black/30">
                  <div
                    className="relative w-full overflow-hidden [&>div]:!m-0 [&>div]:!w-full [&>div]:!max-w-none [&_iframe]:!h-full [&_iframe]:!w-full [&_iframe]:!max-w-none [&_iframe]:!border-0"
                    style={{ aspectRatio: aspect }}
                  >
                    <blockquote
                      className="instagram-media mx-auto w-full"
                      data-instgrm-permalink={url}
                      data-instgrm-version="14"
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex items-center gap-2
                          rounded-xl border border-gris-border bg-gris-surface
                          px-5 py-3 font-space-mono text-sm text-texto-main
                          hover:border-celeste-muted/50 transition-colors
                        "
                      >
                        Ver publicación
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </blockquote>
                  </div>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-center font-space-mono text-xs text-texto-muted hover:text-celeste-muted transition-colors"
                >
                  Abrir en Instagram
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-center gap-4 pt-2 md:hidden">
        <button
          type="button"
          onClick={() => mover(-1)}
          aria-label="Publicación anterior"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gris-border bg-gris-surface/80 text-texto-main hover:border-celeste-muted/50 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5">
          {PUBLICACIONES_INSTAGRAM.map(({ url }, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a publicación ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-celeste-muted' : 'w-1.5 bg-gris-border'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => mover(1)}
          aria-label="Publicación siguiente"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gris-border bg-gris-surface/80 text-texto-main hover:border-celeste-muted/50 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <Script
        id="instagram-embed-script"
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onReady={processEmbeds}
      />
    </section>
  );
}
