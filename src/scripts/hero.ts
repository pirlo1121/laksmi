// Comportamiento de Hero.astro (se carga desde pages/index.astro, en un solo módulo).
import { introDone, scene } from '../animations/setup';
import { EASE } from '../animations/constants';

const hero = document.querySelector<HTMLElement>('[data-hero]')!;
const q = <T extends Element = HTMLElement>(s: string) => hero.querySelector<T>(s)!;
const qa = (s: string) => hero.querySelectorAll<HTMLElement>(s);

let entrancePlayed = false;

scene(1, ({ gsap, c }) => {
  const img = q('.hero__img');
  const shade = q('.hero__shade');
  const fades = qa('[data-hero-fade]');

  /* ---- Reduced motion: solo un fade inicial ---- */
  if (c.reduce) {
    introDone.then(() => gsap.from(hero, { autoAlpha: 0, duration: 0.3 }));
    return;
  }

  /* ---- Entrada (timed), una sola vez ---- */
  if (!entrancePlayed) {
    entrancePlayed = true;
    const chars = qa('.hero__char');
    const light = q('.hero__light');
    gsap.set(chars, { yPercent: 110 });
    gsap.set(light, { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(fades, { autoAlpha: 0, y: 20 });

    introDone.then(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE.enter } });
      tl.to(chars, { yPercent: 0, duration: 1.2, stagger: 0.04 }, 0.15)
        .to(light, { clipPath: 'inset(0 0% 0 0)', duration: 1.2 }, 0.45)
        .to(fades, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.6);
    });
  }

  /* ---- Scroll: la ciudad se acerca mientras el escenario está fijo (sticky) y sigue al salir ----
     Un solo tramo lineal de punta a punta: el zoom no se frena cuando el escenario se suelta. La
     sombra llega en el último tramo, para entregar a La firma sobre el mismo negro. */
  const tl = gsap.timeline({
    defaults: { ease: EASE.scrub },
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  tl.fromTo(img, { scale: 1 }, { scale: c.desktop ? 1.45 : 1.55, duration: 1, force3D: true }, 0);
  tl.fromTo(shade, { opacity: 0 }, { opacity: 0.6, duration: 0.45 }, 0.55);
});
