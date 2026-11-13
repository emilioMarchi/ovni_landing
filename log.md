47 |       setCurrentText(currentPhrase.slice(0, nextChar));
     |       ^
  48 |       setCharIndex(nextChar);
  49 |       timerRef.current = setTimeout(
  50 |         () => {}, (src/components/ui/RotatingText.tsx:47:7)
[browser] Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
    at RotatingText.useEffect (src/components/ui/RotatingText.tsx:47:7)
  45 |     } else {
  46 |       const nextChar = isDeleting ? charIndex - 1 : charIndex + 1;
> 47 |       setCurrentText(currentPhrase.slice(0, nextChar));
     |       ^
  48 |       setCharIndex(nextChar);
  49 |       timerRef.current = setTimeout(
  50 |         () => {}, (src/components/ui/RotatingText.tsx:47:7)
[browser] Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
    at RotatingText.useEffect (src/components/ui/RotatingText.tsx:47:7)
  45 |     } else {
  46 |       const nextChar = isDeleting ? charIndex - 1 : charIndex + 1;
> 47 |       setCurrentText(currentPhrase.slice(0, nextChar));
     |       ^
  48 |       setCharIndex(nextChar);
  49 |       timerRef.current = setTimeout(
  50 |         () => {}, (src/components/ui/RotatingText.tsx:47:7)
[browser] Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
    at RotatingText.useEffect (src/components/ui/RotatingText.tsx:47:7)
  45 |     } else {
  46 |       const nextChar = isDeleting ? charIndex - 1 : charIndex + 1;
> 47 |       setCurrentText(currentPhrase.slice(0, nextChar));
     |       ^
  48 |       setCharIndex(nextChar);
  49 |       timerRef.current = setTimeout(
  50 |         () => {}, (src/components/ui/RotatingText.tsx:47:7)