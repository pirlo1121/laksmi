// Comportamiento de AreasDetalle.astro (se carga desde pages/index.astro, en un solo módulo).
import { scene } from '../animations/setup';
import { EASE } from '../animations/constants';

const root = document.querySelector<HTMLElement>('[data-detalle]')!;
const chapters = [...root.querySelectorAll<HTMLElement>('[data-chap]')];

// Las puertas del yantra de progreso se encienden al recorrer cada área.
const visited = new Set<string>();
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      visited.add((e.target as HTMLElement).dataset.gate!);
      window.dispatchEvent(new CustomEvent('laksmi:area', { detail: { gates: [...visited] } }));
    });
  },
  { rootMargin: '-45% 0px -45% 0px' },
);
chapters.forEach((c) => io.observe(c));

scene(3.5, ({ gsap, c }) => {
  if (c.reduce) return;
  gsap.from(root.querySelectorAll('.detalle__title .line, .detalle__title .light'), {
    yPercent: 110,
    duration: 1.2,
    ease: EASE.enter,
    stagger: 0.1,
    scrollTrigger: { trigger: root, start: 'top 78%', once: true },
  });

  // Cuando el hilo llega al nodo: el punto se enciende y el capítulo se abre desde el hilo.
  chapters.forEach((el) => {
    const right = el.classList.contains('chap--right');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 65%', once: true } });
    tl.from(el.querySelector('.chap__dot'), { scale: 0, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)' }, 0)
      .from(el.querySelector('.chap__num'), { autoAlpha: 0, x: right ? -30 : 30, duration: 1.1, ease: EASE.enter }, 0.1)
      .from(
        el.querySelector('.chap__card'),
        { autoAlpha: 0, x: c.desktop ? (right ? 50 : -50) : 0, y: c.desktop ? 0 : 30, duration: 0.9, ease: EASE.enter },
        0.2,
      )
      .from(el.querySelectorAll('.chap__title .line, .chap__title .light'), { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.08 }, 0.35)
      .from(el.querySelectorAll('[data-chap-item]'), { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.03 }, 0.5);
  });
}, root);
