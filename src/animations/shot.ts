/** Planos del hilo: utilidades del Cierre. */
import type { Gsap, ST } from './setup';

export const $ = <T extends Element = SVGElement>(el: Element, s: string) => el.querySelector<T>(s)!;
export const $$ = <T extends Element = SVGElement>(el: Element, s: string) => [...el.querySelectorAll<T>(s)];

export function shots(gsap: Gsap, ScrollTrigger: ST) {
  /** Cada plano se "filma" una vez al llegar; al volver hacia arriba se rebobina. */
  const take = (el: HTMLElement, build: (tl: gsap.core.Timeline) => void) => {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    const text = $$<HTMLElement>(el, '.shot__label, .shot__cap, .shot__text > .btn, [data-shot-text]');
    tl.from(text, { autoAlpha: 0, y: 28, duration: 1, stagger: 0.12 }, 0.15);
    build(tl);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 62%',
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.reverse(),
    });
  };
  /** Traza líneas SVG de 0 a 100 %. */
  const draw = (tl: gsap.core.Timeline, t: Element[] | Element, at: number, dur = 1.2, stagger = 0) =>
    tl.fromTo(t, { drawSVG: '0%' }, { drawSVG: '100%', duration: dur, stagger, ease: 'power2.inOut' }, at);
  return { take, draw };
}
