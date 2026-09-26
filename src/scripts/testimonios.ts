// Comportamiento de Testimonios.astro (se carga desde pages/index.astro, en un solo módulo).
import { loadGsap, prefersReducedMotion } from '../animations/setup';
import { TESTIMONIO_MS } from '../animations/constants';
import { split } from '../animations/reveal';

const root = document.querySelector<HTMLElement>('[data-testi]')!;
const quotes = [...root.querySelectorAll<HTMLElement>('[data-quote]')];
const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-testi-dot]')];
const live = root.querySelector<HTMLElement>('[data-testi-live]')!;
const pauseBtn = root.querySelector<HTMLButtonElement>('[data-testi-pause]')!;

const reduce = prefersReducedMotion();
let index = 0;
let userPaused = false;
let hovering = false;
let visible = false;

void loadGsap().then(({ gsap }) => {
  const words = quotes.map((q) => split(q.querySelector<HTMLElement>('[data-quote-text]')!, 'words', 'quote__word'));
  let timer: gsap.core.Tween | null = null;

  function go(next: number, fromUser = false) {
    next = (next + quotes.length) % quotes.length;
    if (next === index) return;
    const prev = index;
    index = next;
    // Con rotación automática no se anuncia cada cambio; al usar los controles, sí.
    live.setAttribute('aria-live', fromUser ? 'polite' : 'off');
    quotes.forEach((q, i) => q.classList.toggle('is-active', i === next));
    dots.forEach((d, i) => (i === next ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));

    if (!reduce) {
      const out = quotes[prev];
      const inn = quotes[next];
      const outParts = [...words[prev], out.querySelector('.quote__author')];
      const inParts = [...words[next], inn.querySelector('.quote__author')];
      // La saliente sigue visible mientras sus palabras se desvanecen.
      gsap.set(out, { visibility: 'visible' });
      gsap.to(outParts, {
        autoAlpha: 0,
        duration: 0.3,
        stagger: 0.01,
        overwrite: true,
        onComplete: () => {
          gsap.set(out, { clearProps: 'visibility' });
          gsap.set(outParts, { clearProps: 'opacity,visibility' });
        },
      });
      gsap.fromTo(
        inParts,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.015, delay: 0.3, overwrite: true },
      );
    }
    restartTimer();
  }

  function restartTimer() {
    timer?.kill();
    dots.forEach((d) => gsap.set(d.querySelector('.testi__fill'), { clearProps: 'transform' }));
    if (reduce) return;
    const fill = dots[index].querySelector('.testi__fill');
    timer = gsap.fromTo(
      fill,
      { scaleX: 0 },
      { scaleX: 1, duration: TESTIMONIO_MS / 1000, ease: 'none', onComplete: () => go(index + 1) },
    );
    syncPause();
  }

  function syncPause() {
    if (!timer) return;
    userPaused || hovering || !visible ? timer.pause() : timer.resume();
  }

  root.querySelector('[data-testi-prev]')!.addEventListener('click', () => go(index - 1, true));
  root.querySelector('[data-testi-next]')!.addEventListener('click', () => go(index + 1, true));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i, true)));
  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    pauseBtn.setAttribute('aria-pressed', String(userPaused));
    syncPause();
  });

  // Pausa al hover, al enfocar y cuando la sección no está visible.
  root.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') (hovering = true), syncPause();
  });
  root.addEventListener('pointerleave', () => ((hovering = false), syncPause()));
  root.addEventListener('focusin', () => ((hovering = true), syncPause()));
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget as Node)) (hovering = false), syncPause();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPause();
  }).observe(root);

  // Swipe en táctil.
  let startX = 0;
  const stage = root.querySelector<HTMLElement>('.testi__stage')!;
  stage.addEventListener('pointerdown', (e) => (startX = e.clientX));
  stage.addEventListener('pointerup', (e) => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1), true);
  });

  restartTimer();
});
