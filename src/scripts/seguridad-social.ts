// Comportamiento de SeguridadSocial.astro (se carga desde pages/index.astro, en un solo módulo).
import { scene } from '../animations/setup';
import { DUR, EASE } from '../animations/constants';
import { revealLines } from '../animations/reveal';

const root = document.querySelector<HTMLElement>('[data-ss]')!;
const stage = root.querySelector<HTMLElement>('[data-ss-stage]')!;
const mandala = root.querySelector<HTMLElement>('[data-ss-mandala]')!;
const count = root.querySelector<HTMLElement>('[data-ss-count]')!;
const list = root.querySelector<HTMLElement>('[data-ss-cards]')!;
const cards = [...root.querySelectorAll<HTMLElement>('[data-ss-card]')];
const gates = [...mandala.querySelectorAll<SVGGElement>('[data-gate]')];
const labels = [...mandala.querySelectorAll<HTMLElement>('[data-gate-label]')];

/** Enciende en el yantra las puertas del paquete i. */
let active = -1;
function setActive(i: number) {
  if (i === active) return;
  active = i;
  cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
  const lit = cards[i].dataset.gates!.split(' ');
  gates.forEach((g) => g.classList.toggle('is-lit', lit.includes(g.dataset.gate!)));
  labels.forEach((l) => l.classList.toggle('is-lit', lit.includes(l.dataset.gateLabel!)));
  mandala.classList.toggle('is-full', lit.length === gates.length);
  count.textContent = String(lit.length);
}

// Elegir un paquete también lo muestra en el yantra.
list.addEventListener('change', (e) => {
  const i = cards.findIndex((c) => c.contains(e.target as Node));
  if (i >= 0) setActive(i);
});

scene(4, ({ gsap, ScrollTrigger, c }) => {
  if (c.reduce) return; // aparición directa; el yantra sigue la elección

  // Cortina: el fondo azul oscuro sube.
  gsap.fromTo(
    root.querySelector('.ss__bg'),
    { clipPath: 'inset(100% 0% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 35%', scrub: true },
    },
  );

  revealLines(gsap, root.querySelector('.display')!, root, 'top 60%');
  gsap.from(root.querySelector('.ss__lead'), {
    y: 30,
    autoAlpha: 0,
    duration: DUR.base,
    ease: EASE.heavy,
    scrollTrigger: { trigger: root, start: 'top 55%', once: true },
  });

  // El yantra se traza al llegar: primero las puertas, luego el centro.
  const draw = gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top 75%', once: true } });
  draw
    .from(mandala.querySelectorAll('.y-frame .y-draw'), { drawSVG: 0, duration: DUR.slow, ease: EASE.turn, stagger: 0.05 }, 0)
    .from(mandala.querySelectorAll('.y-core .y-draw'), { drawSVG: 0, duration: DUR.slow, ease: EASE.turn, stagger: 0.02 }, 0.35)
    .from(mandala.querySelector('.ss__gates'), { autoAlpha: 0, duration: DUR.base }, 0.6);

  // Cada paquete entra al llegar.
  cards.forEach((card) =>
    gsap.from(card, {
      y: 40,
      autoAlpha: 0,
      duration: DUR.base,
      ease: EASE.heavy,
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: card, start: 'top 92%', once: true },
    }),
  );
  gsap.from(root.querySelector('.ss__foot'), {
    y: 20,
    autoAlpha: 0,
    duration: DUR.base,
    ease: EASE.heavy,
    scrollTrigger: { trigger: root.querySelector('.ss__foot'), start: 'top 92%', once: true },
  });

  // El paquete en foco (el que cruza el 60 % de la pantalla) enciende sus puertas.
  // Un solo trigger: el tramo de la lista se reparte entre los paquetes. Nada corre por cuadro.
  // El primer estado se aplica sin transiciones: la sección aún está fuera de pantalla y animar ~30
  // colores, bordes y puertas (nada de eso va al compositor) solo cargaba el hilo principal al montar.
  stage.classList.add('is-instant', 'is-live');
  const pick = (p: number) => setActive(Math.min(cards.length - 1, Math.floor(p * cards.length)));
  const st = ScrollTrigger.create({
    trigger: list,
    start: 'top 60%',
    end: 'bottom 60%',
    onUpdate: (self) => pick(self.progress),
    onRefresh: (self) => pick(self.progress),
  });
  pick(st.progress);
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('is-instant')));

  return () => stage.classList.remove('is-live');
}, root);
