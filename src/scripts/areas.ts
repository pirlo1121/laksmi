// Comportamiento de Areas.astro (se carga desde pages/index.astro, en un solo módulo).
import { scene } from '../animations/setup';
import { DUR, EASE } from '../animations/constants';
import { revealLines } from '../animations/reveal';

const root = document.querySelector<HTMLElement>('[data-areas]')!;

scene(3, ({ gsap, c }) => {
  if (c.reduce) return;
  revealLines(gsap, root.querySelector('.areas__title')!, root, 'top 75%');
  gsap.from(root.querySelectorAll('.areas__head .eyebrow, .areas__intro'), {
    autoAlpha: 0,
    y: 16,
    duration: DUR.base,
    ease: EASE.heavy,
    stagger: 0.1,
    scrollTrigger: { trigger: root, start: 'top 75%', once: true },
  });

  // Cada nodo se enciende cuando el hilo llega a él: punto → conector → tarjeta.
  root.querySelectorAll<HTMLElement>('[data-anode]').forEach((node) => {
    const right = node.classList.contains('anode--right');
    const tl = gsap.timeline({ scrollTrigger: { trigger: node, start: 'top 70%', once: true } });
    tl.from(node.querySelector('.anode__dot'), { scale: 0, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)' }, 0)
      .from(node.querySelector('.anode__link'), { scaleX: 0, duration: 0.5, ease: 'power2.out' }, 0.25)
      .from(
        node.querySelector('.anode__card'),
        { autoAlpha: 0, x: c.desktop ? (right ? 40 : -40) : 0, y: c.desktop ? 0 : 24, duration: 0.9, ease: EASE.enter },
        0.35,
      );
  });
}, root);
