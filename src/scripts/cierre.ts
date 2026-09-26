// Comportamiento de Cierre.astro (se carga desde pages/index.astro, en un solo módulo).
import { scene } from '../animations/setup';
import { $, $$, shots } from '../animations/shot';

const root = document.querySelector<HTMLElement>('[data-cierre]')!;
const shot = (name: string) => root.querySelector<HTMLElement>(`[data-shot="${name}"]`)!;

scene(6.5, ({ gsap, ScrollTrigger, c }) => {
  if (c.reduce) return;
  const { take, draw } = shots(gsap, ScrollTrigger);

  // Legado: el recorrido completo, parada por parada.
  take(shot('legado'), (tl) => {
    const s = shot('legado');
    draw(tl, $(s, '[data-map-line]'), 0, 1.6);
    tl.from($$(s, '[data-map-stop]'), { autoAlpha: 0, duration: 0.5, stagger: 0.22 }, 0.1);
  });

  // Cierre: el contorno del loto y luego el yantra completo del logo.
  take(shot('cierre'), (tl) => {
    const y = $(shot('cierre'), '.cierre__yantra');
    draw(tl, $$(y, '.y-circles .y-draw'), 0, 0.9, 0.12);
    draw(tl, $$(y, '.y-petals .y-draw'), 0.4, 0.9, 0.05);
    draw(tl, $$(y, '.y-triangles .y-draw, .y-bindu .y-draw'), 0.8, 0.9, 0.08);
    draw(tl, $$(y, '.y-frame .y-draw'), 1.1, 1, 0.03);
  });
}, root);
