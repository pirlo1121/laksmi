// Comportamiento de Contacto.astro (se carga desde pages/index.astro, en un solo módulo).
import { scene } from '../animations/setup';
import { DUR, EASE } from '../animations/constants';
import { revealLines } from '../animations/reveal';
import { contacto } from '../data/site';

const root = document.querySelector<HTMLElement>('[data-contacto]')!;

// Mapa diferido: el iframe solo se carga al pedirlo. [PENDIENTE] ubicación exacta.
const mapaBtn = root.querySelector<HTMLButtonElement>('[data-mapa-btn]')!;
const mapa = root.querySelector<HTMLElement>('[data-mapa]')!;
mapaBtn.addEventListener('click', () => {
  if (!mapa.firstElementChild) {
    const iframe = document.createElement('iframe');
    iframe.title = 'Ubicación de LAKSMI Abogados en Google Maps';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(contacto.mapaQuery)}&output=embed`;
    mapa.append(iframe);
  }
  mapa.hidden = !mapa.hidden;
  mapaBtn.setAttribute('aria-expanded', String(!mapa.hidden));
  mapaBtn.textContent = mapa.hidden ? 'Ver mapa' : 'Ocultar mapa';
});

scene(7, ({ gsap, c }) => {
  if (c.reduce) return; // el yantra aparece ya dibujado

  // La historia se cierra: el yantra se traza completo una última vez.
  const yantra = root.querySelector('.contacto__yantra')!;
  const gates = yantra.querySelectorAll('.y-gate .y-draw');
  const core = yantra.querySelectorAll('.y-core .y-draw');
  const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 65%', once: true } });
  tl.fromTo(core, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut', stagger: 0.015 }, 0);
  tl.fromTo(gates, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.1, ease: 'power2.inOut' }, 0.5);

  revealLines(gsap, root.querySelector('.display')!, root, 'top 65%');
  gsap.from(root.querySelectorAll('[data-contacto-fade]'), {
    y: 30,
    autoAlpha: 0,
    duration: DUR.base,
    ease: EASE.heavy,
    stagger: 0.1,
    scrollTrigger: { trigger: root, start: 'top 55%', once: true },
  });
  gsap.from(root.querySelectorAll('[data-form-field]'), {
    y: 24,
    autoAlpha: 0,
    duration: DUR.base,
    ease: EASE.heavy,
    stagger: 0.06,
    scrollTrigger: { trigger: root.querySelector('[data-form]'), start: 'top 80%', once: true },
  });
}, root);
