/**
 * Orquestador de animaciones.
 * - Carga GSAP, ScrollTrigger, DrawSVG y Lenis con import dinámico (el HTML ya es visible sin JS).
 * - Cada sección registra su escena con `scene(orden, fn, raíz?)` desde su propio <script>.
 * - Todas las escenas corren dentro de un único gsap.matchMedia() con tres contextos
 *   (desktop, mobile, reduce), en orden de página.
 * - Las escenas con `raíz` se montan tarde: cuando su sección está a ~1,5 pantallas o, si no, en
 *   tiempo ocioso después de la intro. Así el arranque no bloquea el hilo principal mientras corre
 *   el preloader (en un móvil medio, montar todo de una vez eran ~0,5 s de bloqueo).
 */
import type { gsap as GsapT } from 'gsap';
import type { ScrollTrigger as ScrollTriggerT } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { BP } from './constants';

export type Gsap = typeof GsapT;
export type ST = typeof ScrollTriggerT;

export interface Conditions {
  desktop: boolean;
  mobile: boolean;
  reduce: boolean;
}

export interface SceneApi {
  gsap: Gsap;
  ScrollTrigger: ST;
  c: Conditions;
}

type SceneFn = (api: SceneApi) => void | (() => void);

const scenes: { order: number; fn: SceneFn; root?: Element | null }[] = [];

/**
 * Registra la animación de una sección. `order` = posición en la página.
 * Con `root`, la escena se monta cuando esa sección se acerca a la pantalla (o en tiempo ocioso).
 * Sin `root`, se monta al arrancar (lo que se ve de entrada: nav, hero, hilo).
 */
export function scene(order: number, fn: SceneFn, root?: Element | null) {
  scenes.push({ order, fn, root });
}

/** requestIdleCallback con respaldo para Safari. */
const idle = (cb: () => void) => {
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(cb, { timeout: 1200 });
  else setTimeout(cb, 60);
};

let libs: Promise<{ gsap: Gsap; ScrollTrigger: ST }> | null = null;

export function loadGsap() {
  libs ??= Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/DrawSVGPlugin'),
  ]).then(([g, s, d]) => {
    g.gsap.registerPlugin(s.ScrollTrigger, d.DrawSVGPlugin);
    return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
  });
  return libs;
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Intro (preloader → hero) ---------- */

let resolveIntro!: () => void;
/** Se resuelve cuando el preloader entrega la escena al hero (o de inmediato si no hay preloader). */
export const introDone = new Promise<void>((r) => (resolveIntro = r));
export const finishIntro = () => resolveIntro();

/* ---------- Scroll (Lenis) ---------- */

let lenis: Lenis | null = null;

export function lockScroll(locked: boolean) {
  document.body.classList.toggle('is-locked', locked);
  if (lenis) locked ? lenis.stop() : lenis.start();
}

/** Anclas que no son simples elementos (p. ej. un tramo dentro de un pin). */
const anchorResolvers = new Map<string, () => number | null>();
export function registerAnchor(hash: string, resolve: () => number | null) {
  anchorResolvers.set(hash, resolve);
  return () => {
    if (anchorResolvers.get(hash) === resolve) anchorResolvers.delete(hash);
  };
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Desplaza al instante (sin suavizado); útil para compensar cambios de altura. */
export function scrollByNow(dy: number) {
  if (lenis) lenis.scrollTo(lenis.scroll + dy, { immediate: true, force: true });
  else window.scrollBy(0, dy);
}

export function scrollToHash(hash: string) {
  const resolved = anchorResolvers.get(hash)?.();
  if (resolved != null) return scrollToY(resolved);
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0;
  scrollToY(el.getBoundingClientRect().top + window.scrollY - (hash === '#top' ? 0 : navH * 0.5));
}

function interceptAnchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.hash.length < 2) return;
    if (!anchorResolvers.has(a.hash) && !document.querySelector(a.hash)) return;
    e.preventDefault();
    history.replaceState(null, '', a.hash);
    scrollToHash(a.hash);
  });
}

async function initLenis(gsap: Gsap, ScrollTrigger: ST) {
  const touch = window.matchMedia('(pointer: coarse)').matches;
  if (touch || prefersReducedMotion() || window.matchMedia(BP.mobile).matches) return;
  const { default: LenisCtor } = await import('lenis');
  lenis = new LenisCtor({ lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  if (document.body.classList.contains('is-locked')) lenis.stop();
}

/* ---------- Arranque ---------- */

async function start() {
  interceptAnchors();
  const { gsap, ScrollTrigger } = await loadGsap();
  await initLenis(gsap, ScrollTrigger);

  scenes.sort((a, b) => a.order - b.order);
  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: `${BP.desktop} and (prefers-reduced-motion: no-preference)`,
      mobile: `${BP.mobile} and (prefers-reduced-motion: no-preference)`,
      reduce: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const c = ctx.conditions as unknown as Conditions;
      const cleanups: (() => void)[] = [];
      let alive = true;
      // ctx.add: lo que se crea después sigue perteneciendo a este contexto (se revierte al cambiar de breakpoint).
      const mount = (fn: SceneFn) =>
        ctx.add(() => {
          const cleanup = fn({ gsap, ScrollTrigger, c });
          if (typeof cleanup === 'function') cleanups.push(cleanup);
        });

      // Diferidas, en orden de página.
      const pending = new Map<Element, SceneFn>();
      for (const s of scenes) {
        if (s.root) pending.set(s.root, s.fn);
        else mount(s.fn);
      }
      const mountRoot = (root: Element) => {
        const fn = pending.get(root);
        if (!fn || !alive) return;
        pending.delete(root);
        io.unobserve(root);
        mount(fn);
      };
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && mountRoot(e.target)),
        { rootMargin: '150% 0px' },
      );
      pending.forEach((_, root) => io.observe(root));
      // Lo que aún no se acercó se monta de a una escena por hueco ocioso, cuando termina la intro.
      introDone.then(() => {
        const next = () => {
          const root = pending.keys().next().value;
          if (!root || !alive) return;
          mountRoot(root);
          idle(next);
        };
        idle(next);
      });

      return () => {
        alive = false;
        io.disconnect();
        cleanups.forEach((fn) => fn());
      };
    },
  );

  // Las fuentes y la imagen del hero cambian medidas: recalcular pins.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  // Deep link a un área o a contacto con preselección (?area=penal&paquete=eps-arl).
  if (location.hash) {
    const hash = location.hash;
    introDone.then(() => requestAnimationFrame(() => scrollToHash(hash)));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void start(), { once: true });
} else {
  queueMicrotask(() => void start());
}
