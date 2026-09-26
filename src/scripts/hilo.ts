// Comportamiento de Hilo.astro (se carga desde pages/index.astro, en un solo módulo).
import { scene } from '../animations/setup';

const track = document.querySelector<HTMLElement>('[data-hilo]')!;
const fill = track.querySelector<HTMLElement>('[data-hilo-fill]')!;
const host = track.offsetParent as HTMLElement | null;

const center = (sel: string) => {
  const el = document.querySelector<HTMLElement>(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.top + r.height / 2 + window.scrollY;
};

/** Coloca el hilo entre sus dos anclas (en coordenadas de su contenedor). */
function place() {
  const a = center('[data-thread-start]');
  const b = center('[data-thread-end]');
  if (a == null || b == null || !host) return { a: 0, b: 0 };
  const hostTop = host.getBoundingClientRect().top + window.scrollY;
  track.style.top = `${a - hostTop}px`;
  track.style.height = `${Math.max(0, b - a)}px`;
  track.classList.add('is-placed');
  return { a, b };
}
place();

/* ---- La luz del loto: un bloque se enciende en cuanto el loto (media pantalla) llega a su borde
   superior, y queda encendido. Se comparan posiciones ya medidas con el scroll: nada de layout por
   cuadro, y ningún bloque queda a oscuras aunque el scroll salte (anclas, menú). ---- */
// Seguridad social no entra: tiene su propia luz (el paquete en foco) y sobre su azul el texto
// secundario no admite penumbra sin perder contraste.
const LUMEN = [
  '.firma__head', '.cifras__cell', '.areas__head', '.anode', '.shot__visual', '.shot__text',
  '.detalle__head', '.chap', '.equipo__head', '.miembro', '.testi__inner',
].join(', ');
const motion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
let pending: { el: HTMLElement; top: number }[] = [];
let measureLumen = () => {};
if (motion) {
  const blocks = [...document.querySelectorAll<HTMLElement>(LUMEN)];
  blocks.forEach((el) => (el.dataset.lumen = ''));
  document.documentElement.classList.add('hilo-on');

  measureLumen = () => {
    pending = blocks
      .filter((el) => !el.classList.contains('is-lit'))
      .map((el) => ({ el, top: el.getBoundingClientRect().top + window.scrollY }))
      .sort((a, b) => a.top - b.top);
    light();
  };
  let raf = 0;
  const light = () => {
    raf = 0;
    const line = window.scrollY + window.innerHeight * 0.55;
    let i = 0;
    while (i < pending.length && pending[i].top <= line) pending[i++].el.classList.add('is-lit');
    if (i) pending = pending.slice(i);
    if (!pending.length) window.removeEventListener('scroll', onScroll);
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(light);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  measureLumen();
}

// Se registra al final: así mide la página ya con todas las demás escenas montadas.
scene(99, ({ gsap, ScrollTrigger, c }) => {
  place();
  if (c.reduce) return;

  // Borde del relleno = loto, siempre a media pantalla.
  gsap.fromTo(
    fill,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        start: () => place().a - window.innerHeight / 2,
        end: () => place().b - window.innerHeight / 2,
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );

  // Las posiciones de los bloques cambian con cada refresh (fuentes, imágenes, resize).
  ScrollTrigger.addEventListener('refresh', measureLumen);

  // Si cambia el alto de la página (imágenes, fuentes, paneles), se vuelve a medir.
  // Solo el alto: los cambios de ancho ya los cubre el resize de ScrollTrigger.
  let t = 0;
  let lastH = document.body.offsetHeight;
  const ro = new ResizeObserver(([entry]) => {
    const h = Math.round(entry.contentRect.height);
    if (Math.abs(h - lastH) < 2) return;
    lastH = h;
    clearTimeout(t);
    t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
  });
  ro.observe(document.body);
  return () => {
    ro.disconnect();
    ScrollTrigger.removeEventListener('refresh', measureLumen);
  };
});
