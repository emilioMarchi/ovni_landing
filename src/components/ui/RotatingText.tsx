'use client';

import { useEffect, useState, useRef } from 'react';

type RotatingTextProps = {
  phrases: string[];
  writeSpeed?: number;
  pauseBetween?: number;
  className?: string;
  showCursor?: boolean;
};

export default function RotatingText({
  phrases,
  writeSpeed = 40,
  pauseBetween = 2200,
  className = '',
  showCursor = true,
}: RotatingTextProps) {
  const [currentText, setCurrentText] = useState('');
  const [isWriting, setIsWriting] = useState(true);
  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    clearTimer();

    const tick = () => {
      const phraseIndex = phraseIndexRef.current;
      const charIndex = charIndexRef.current;
      const currentPhrase = phrases[phraseIndex];

      if (charIndex < currentPhrase.length) {
        charIndexRef.current = charIndex + 1;
        setCurrentText(currentPhrase.slice(0, charIndex + 1));
        setIsWriting(true);
        timerRef.current = setTimeout(tick, writeSpeed);
      } else {
        setIsWriting(false);
        timerRef.current = setTimeout(() => {
          phraseIndexRef.current = (phraseIndex + 1) % phrases.length;
          charIndexRef.current = 0;
          setCurrentText('');
          tick();
        }, pauseBetween);
      }
    };

    timerRef.current = setTimeout(tick, 100);

    return clearTimer;
  }, [phrases, writeSpeed, pauseBetween]);

  return (
    <span className={`relative inline-block ${className}`}>
      {currentText}
      {showCursor && isWriting && (
        <span className="ml-0.5 animate-pulse bg-current rounded"> </span>
      )}
    </span>
  );
}
