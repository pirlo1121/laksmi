// Geometría del yantra de la marca (unidades del viewBox -575 -575 1150 1150, centro en 0,0).
// La comparten el componente SVG (Yantra.astro) y el lienzo del cursor (YantraCursor.astro).

export const VIEWBOX = 1150;

// Un lado del marco (norte), de diagonal a diagonal. Los otros tres son rotaciones de 90°.
export const OUTER = 'M -480 -480 H -326 V -562 H 326 V -480 H 480';
export const INNER = 'M -430 -430 H -143 V -466 H -275 V -514 H 275 V -466 H 143 V -430 H 430';

export const GATES = [
  { id: 'n', rot: 0 },
  { id: 'e', rot: 90 },
  { id: 's', rot: 180 },
  { id: 'w', rot: 270 },
] as const;

export const CIRCLES = [405, 361, 258];
export const BINDU = 14;

export const PETAL =
  'M -98.7 -238.4 C -96 -268 -86 -284 -66 -298 L 0 -338 L 66 -298 C 86 -284 96 -268 98.7 -238.4';
export const PETALS = Array.from({ length: 8 }, (_, i) => i * 45);

export const TRIANGLES = [
  '0,-255 242,73 -242,73',
  '0,255 242,-73 -242,-73',
  '0,-185 177,121 -177,121',
  '0,185 177,-121 -177,-121',
];

/** Distancia mínima del centro al borde del portal (el marco interior). */
export const PORTAL_INSET = 430;

/**
 * Contorno cerrado del marco interior (las 4 puertas): el hueco del portal.
 * Se arma rotando el lado norte 90° tres veces.
 */
export const PORTAL = (() => {
  const side: [number, number][] = [
    [-430, -430], [-143, -430], [-143, -466], [-275, -466], [-275, -514],
    [275, -514], [275, -466], [143, -466], [143, -430],
  ];
  const pts: [number, number][] = [];
  for (let k = 0; k < 4; k++) {
    for (const [x, y] of side) {
      // rotate(90°·k): (x, y) → (−y, x)
      let p: [number, number] = [x, y];
      for (let i = 0; i < k; i++) p = [-p[1], p[0]];
      pts.push(p);
    }
  }
  return 'M ' + pts.map(([x, y]) => `${x} ${y}`).join(' L ') + ' Z';
})();
