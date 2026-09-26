// Comportamiento de YantraProgreso.astro (se carga desde pages/index.astro, en un solo módulo).
import { scene } from '../animations/setup';

const el = document.querySelector<HTMLElement>('[data-progreso]')!;
const gates = el.querySelectorAll<SVGGElement>('.y-gate');

// Aparece al salir del hero.
scene(0, ({ ScrollTrigger }) => {
  ScrollTrigger.create({
    trigger: '[data-cifras]',
    start: 'top 90%',
    endTrigger: '[data-footer]',
    end: 'top bottom',
    onToggle: (self) => el.classList.toggle('is-visible', self.isActive),
  });
});

// Las puertas se encienden a medida que se recorren las áreas.
window.addEventListener('laksmi:area', (e) => {
  const { gates: lit } = (e as CustomEvent<{ gates: string[] }>).detail;
  gates.forEach((g) => g.classList.toggle('is-lit', lit.includes(g.dataset.gate!)));
});
