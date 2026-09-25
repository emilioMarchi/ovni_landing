'use client';

import React from 'react';

interface AudioWaveformProps {
  active?: boolean;
  color?: string;
  barCount?: number;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  active = true,
  color = 'bg-celeste-muted',
  barCount = 7,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center gap-1 h-5 px-2 ${className}`}
      aria-label="Onda de audio"
    >
      {Array.from({ length: barCount }).map((_, index) => {
        // Generar alturas y animaciones variadas
        const delays = ['0ms', '150ms', '300ms', '450ms', '200ms', '100ms', '250ms'];
        const delay = delays[index % delays.length];

        return (
          <span
            key={index}
            style={{
              animationDelay: delay,
              animationDuration: active ? '0.8s' : '0s',
            }}
            className={`
              w-1 rounded-full transition-all duration-300
              ${color}
              ${
                active
                  ? 'animate-pulse h-full'
                  : 'h-1.5 opacity-40'
              }
            `}
          />
        );
      })}
    </div>
  );
};
