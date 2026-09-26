// Comportamiento de Equipo.astro (se carga desde pages/index.astro, en un solo módulo).
import { lockScroll, loadGsap, prefersReducedMotion, scene, scrollToY } from '../animations/setup';
import { BP, DUR, EASE } from '../animations/constants';
import { revealLines } from '../animations/reveal';

const root = document.querySelector<HTMLElement>('[data-equipo]')!;

// Cuando el hilo llega al equipo, la rama se abre hacia cada integrante (transición CSS).
const grid = root.querySelector<HTMLElement>('[data-equipo-grid]')!;
new IntersectionObserver(
  ([e], obs) => {
    if (!e.isIntersecting) return;
    grid.classList.add('is-linked');
    obs.disconnect();
  },
  { rootMargin: '0px 0px -35% 0px' },
).observe(grid);
const openers = [...root.querySelectorAll<HTMLButtonElement>('[data-perfil-open]')];
let current: { btn: HTMLButtonElement; panel: HTMLElement } | null = null;

const isMobile = () => window.matchMedia(BP.mobile).matches;

/* ---- Video de los socios: solo corre visible y sin reduced-motion ---- */
const VIDEO = { w: 1280, h: 720 };
// Caja del yantra luminoso dentro del cuadro del video (fracciones del ancho/alto).
const YANTRA_BOX = { x0: 0.345, x1: 0.65, y0: 0.17, y1: 0.7 };
const video = root.querySelector<HTMLVideoElement>('[data-equipo-video]')!;
// El póster (primer cuadro) se pide cuando la sección se acerca, no al cargar la página:
// así no compite con la imagen del hero.
new IntersectionObserver(
  ([entry], obs) => {
    if (!entry.isIntersecting) return;
    video.poster = video.dataset.poster!;
    obs.disconnect();
  },
  { rootMargin: '150% 0px' },
).observe(video);
if (!prefersReducedMotion()) {
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        video.preload = 'auto';
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    },
    { rootMargin: '200px 0px' },
  ).observe(video);
}

async function animateHeight(panel: HTMLElement, open: boolean) {
  if (prefersReducedMotion() || isMobile()) return;
  const { gsap, ScrollTrigger } = await loadGsap();
  await gsap
    .fromTo(
      panel,
      { height: open ? 0 : panel.offsetHeight },
      { height: open ? 'auto' : 0, duration: 0.6, ease: EASE.enter, clearProps: 'height' },
    )
    .then();
  ScrollTrigger.refresh();
}

async function close(returnFocus = true) {
  if (!current) return;
  const { btn, panel } = current;
  current = null;
  btn.setAttribute('aria-expanded', 'false');
  await animateHeight(panel, false);
  panel.hidden = true;
  if (isMobile()) lockScroll(false);
  if (returnFocus) btn.focus();
}

async function open(btn: HTMLButtonElement) {
  const panel = document.getElementById(btn.getAttribute('aria-controls')!)!;
  if (current?.btn === btn) return close();
  if (current) await close(false);
  current = { btn, panel };
  btn.setAttribute('aria-expanded', 'true');
  panel.hidden = false;
  if (isMobile()) lockScroll(true);
  panel.querySelector<HTMLElement>('.perfil__name')?.focus({ preventScroll: true });
  if (!isMobile()) {
    scrollToY(panel.getBoundingClientRect().top + window.scrollY - 120);
  }
  await animateHeight(panel, true);
}

openers.forEach((btn) => btn.addEventListener('click', () => void open(btn)));
root.querySelectorAll('[data-perfil-close]').forEach((b) => b.addEventListener('click', () => void close()));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && current) void close();
});

scene(5, ({ gsap, c }) => {
  if (c.reduce) return; // póster fijo, fotos a color, sin clip-path

  // Transición: el marco empieza recortado justo sobre el yantra del video (la puerta)
  // y se abre hasta mostrar a los socios. Sigue al scroll, pero sin pin: nunca lo detiene.
  const hero = root.querySelector<HTMLElement>('.equipo__hero')!;
  const frame = root.querySelector<HTMLElement>('[data-equipo-frame]')!;
  const gate = root.querySelector<HTMLElement>('[data-equipo-gate]')!;
  const gatePaths = gate.querySelectorAll('.y-draw');

  const doorway = () => {
    const w = frame.clientWidth;
    const h = frame.clientHeight;
    const s = Math.max(w / VIDEO.w, h / VIDEO.h); // object-fit: cover
    const vw = VIDEO.w * s;
    const vh = VIDEO.h * s;
    const ox = (w - vw) / 2;
    const oy = (h - vh) / 2;
    const left = ox + YANTRA_BOX.x0 * vw;
    const right = ox + YANTRA_BOX.x1 * vw;
    const top = oy + YANTRA_BOX.y0 * vh;
    const bottom = oy + YANTRA_BOX.y1 * vh;
    return { left, top, width: right - left, height: bottom - top, w, h };
  };
  const closed = () => {
    const d = doorway();
    return `inset(${d.top}px ${d.w - d.left - d.width}px ${d.h - d.top - d.height}px ${d.left}px round 2px)`;
  };
  const placeGate = () => {
    const d = doorway();
    const size = Math.max(d.width, d.height);
    gsap.set(gate, {
      x: d.left + d.width / 2 - size / 2,
      y: d.top + d.height / 2 - size / 2,
      width: size,
      height: size,
    });
  };

  placeGate();
  gsap.set(gate, { visibility: 'visible' });
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top 90%',
      end: 'top 10%',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onRefresh: placeGate,
    },
  });
  tl.fromTo(frame, { clipPath: closed }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.7, ease: 'power2.inOut' }, 0.3)
    .fromTo(gatePaths, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.35, stagger: 0.004 }, 0)
    .to(gate, { scale: 1.35, autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, 0.4);

  revealLines(gsap, root.querySelector('.equipo__title')!, root.querySelector('.equipo__head')!, 'top 85%');
  gsap.from(root.querySelectorAll('.equipo__head .eyebrow, .equipo__sub'), {
    autoAlpha: 0,
    y: 20,
    duration: DUR.base,
    ease: EASE.heavy,
    scrollTrigger: { trigger: root.querySelector('.equipo__head'), start: 'top 85%', once: true },
  });

  const photos = root.querySelectorAll('.miembro__photo');
  gsap.fromTo(
    photos,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: DUR.slow,
      ease: EASE.enter,
      stagger: 0.12,
      scrollTrigger: { trigger: root.querySelector('.equipo__grid'), start: 'top 80%', once: true },
    },
  );
  gsap.from(root.querySelectorAll('.miembro__name, .miembro__role, .miembro__more'), {
    autoAlpha: 0,
    y: 16,
    duration: DUR.base,
    ease: EASE.heavy,
    stagger: 0.04,
    delay: 0.3,
    scrollTrigger: { trigger: root.querySelector('.equipo__grid'), start: 'top 80%', once: true },
  });
}, root);
