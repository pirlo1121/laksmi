export const EASE = {
  enter: 'expo.out',
  exit: 'power2.in',
  scrub: 'none',
  heavy: 'power3.out',
  turn: 'power2.inOut',
} as const;

export const DUR = { fast: 0.5, base: 0.9, slow: 1.4 } as const;

export const SCROLL = {
  heroDesktop: '+=180%', // distancia del pin del hero
  heroMobile: '+=90%',
  areasPerStep: 100, // vh de scroll por cada área (desktop)
} as const;

export const BP = {
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 768px)',
} as const;

/** Las áreas solo se fijan si hay alto suficiente para leer una área completa. */
export const AREAS_MIN_HEIGHT = '(min-height: 640px)';

export const PRELOADER = {
  maxWait: 2.5, // s: tope de espera por fuentes + imagen del hero
  sessionKey: 'laksmi:visited',
} as const;

export const TESTIMONIO_MS = 6000;
