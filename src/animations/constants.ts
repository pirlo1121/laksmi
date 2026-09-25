export const EASE = {
  enter: 'expo.out',
  exit: 'power2.in',
  scrub: 'none',
  heavy: 'power3.out',
  turn: 'power2.inOut',
} as const;

export const DUR = { fast: 0.5, base: 0.9, slow: 1.4 } as const;

export const BP = {
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 768px)',
} as const;

export const PRELOADER = {
  maxWait: 4, // s: tope de espera por fuentes + imagen del hero
} as const;

export const TESTIMONIO_MS = 6000;
