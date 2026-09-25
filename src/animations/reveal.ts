/** Utilidades de reveal compartidas entre secciones. */
import type { Gsap } from './setup';
import { DUR, EASE } from './constants';

/**
 * Parte el texto de un elemento en spans (letras o palabras) conservando el texto accesible:
 * el texto completo queda en un span .sr-only y los fragmentos visuales llevan aria-hidden.
 */
export function split(el: HTMLElement, by: 'chars' | 'words', cls = 'split'): HTMLElement[] {
  if (el.dataset.split === by) return [...el.querySelectorAll<HTMLElement>(`.${cls}`)];
  const text = el.textContent?.trim() ?? '';
  el.dataset.split = by;
  el.textContent = '';
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = text;
  el.append(sr);
  const parts = by === 'chars' ? [...text] : text.split(/\s+/);
  return parts.map((part, i) => {
    const outer = document.createElement('span');
    outer.className = 'mask-inline';
    outer.setAttribute('aria-hidden', 'true');
    outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em';
    const inner = document.createElement('span');
    inner.className = cls;
    inner.style.display = 'inline-block';
    inner.textContent = part === ' ' ? ' ' : part;
    outer.append(inner);
    el.append(outer);
    if (by === 'words' && i < parts.length - 1) el.append(' ');
    return inner;
  });
}

/** Fade-up al entrar al viewport, una sola vez. */
export function fadeUpOnEnter(
  gsap: Gsap,
  targets: gsap.TweenTarget,
  trigger: Element,
  opts: { y?: number; stagger?: number; delay?: number; start?: string } = {},
) {
  return gsap.from(targets, {
    y: opts.y ?? 40,
    autoAlpha: 0,
    duration: DUR.base,
    ease: EASE.heavy,
    stagger: opts.stagger ?? 0.08,
    delay: opts.delay ?? 0,
    scrollTrigger: { trigger, start: opts.start ?? 'top 75%', once: true },
  });
}

/** Reveal de líneas de título: cada .line sube desde su máscara. */
export function revealLines(gsap: Gsap, title: Element, trigger: Element = title, start = 'top 75%') {
  const lines = title.querySelectorAll('.line, .light');
  return gsap.from(lines, {
    yPercent: 110,
    duration: DUR.slow,
    ease: EASE.enter,
    stagger: 0.1,
    scrollTrigger: { trigger, start, once: true },
  });
}

/** Solo un fade corto (modo reduced-motion). */
export function softFade(gsap: Gsap, targets: gsap.TweenTarget, trigger: Element) {
  return gsap.from(targets, {
    autoAlpha: 0,
    duration: 0.3,
    scrollTrigger: { trigger, start: 'top 85%', once: true },
  });
}
