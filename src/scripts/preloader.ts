// Comportamiento de Preloader.astro (se carga desde pages/index.astro, en un solo módulo).
import { finishIntro, loadGsap, lockScroll } from '../animations/setup';
import { PRELOADER } from '../animations/constants';
import { PORTAL_INSET, VIEWBOX } from '../data/yantra';

const root = document.querySelector<HTMLElement>('[data-preloader]');
const active = root && getComputedStyle(root).display !== 'none';

if (!active) {
  root?.remove();
  finishIntro();
} else {
  // La entrada ocurre en el hero: arrancar siempre desde arriba.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);
  lockScroll(true);
  void run(root);
}

/** Espera fuentes + imagen del hero, con un tope. */
function assetsReady() {
  const img = document.querySelector<HTMLImageElement>('[data-hero-img]');
  const imgReady = img && !img.complete ? new Promise((r) => img.addEventListener('load', r, { once: true })) : null;
  const decoded = imgReady?.then(() => img?.decode?.().catch(() => {}));
  return Promise.race([
    Promise.all([document.fonts?.ready, decoded]),
    new Promise((r) => setTimeout(r, PRELOADER.maxWait * 1000)),
  ]);
}

async function run(root: HTMLElement) {
  const ready = assetsReady();
  const { gsap } = await loadGsap();
  root.style.animation = 'none'; // desactiva el salvavidas CSS
  const svg = root.querySelector<SVGSVGElement>('.preloader__yantra')!;
  const scene = svg.querySelector<SVGGElement>('.y-scene')!;
  const veil = svg.querySelector('.portal-veil');
  const text = root.querySelector('.preloader__text');
  const gates = svg.querySelectorAll('.y-gate .y-draw');
  const core = svg.querySelectorAll('.y-core .y-draw');
  const media = document.querySelector<HTMLElement>('[data-hero-media]');

  gsap.set([gates, core], { drawSVG: '0%' });
  gsap.set(svg, { visibility: 'visible' });

  // 0.0s el yantra se traza: primero las puertas, luego el centro.
  const draw = gsap.timeline();
  draw
    .to(gates, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut', stagger: 0.02 })
    .to(core, { drawSVG: '100%', duration: 0.55, ease: 'power2.inOut', stagger: 0.012 }, 0.3)
    .to(text, { opacity: 1, duration: 0.4 }, 0.9);

  await Promise.all([draw.then(), ready, new Promise((r) => setTimeout(r, 1100))]);

  // La tapa del SVG ya cubre la pantalla: el fondo del contenedor sobra y taparía el hueco.
  root.style.background = 'transparent';

  // Escala a la que el hueco del portal (su lado más corto) ya cubre la diagonal de la pantalla.
  const px = svg.getBoundingClientRect().width / VIEWBOX;
  const scale = (Math.hypot(window.innerWidth, window.innerHeight) / 2 / (PORTAL_INSET * px)) * 1.08;

  const exit = gsap.timeline({
    onComplete: () => {
      root.remove();
      lockScroll(false);
    },
  });

  // 1) El portal se abre: Bogotá aparece al fondo, dentro del marco.
  if (media) exit.set(media, { scale: 1.6, transformOrigin: '50% 55%' }, 0);
  exit
    .to(text, { opacity: 0, y: 8, duration: 0.4, ease: 'power2.in' }, 0)
    .to(veil, { opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.05)
    .to(core, { opacity: 0.35, duration: 0.9, ease: 'power2.out' }, 0.05)
    .to(gates, { strokeWidth: 2, duration: 0.6 }, 0.05);

  // 2) Entramos: el yantra crece hasta que el marco queda fuera de cuadro; la ciudad se acerca.
  exit
    .to(scene, { scale, svgOrigin: '0 0', duration: 1.7, ease: 'expo.inOut' }, 0.8)
    .to(core, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 0.9);
  if (media) exit.to(media, { scale: 1, duration: 2.1, ease: 'expo.inOut', clearProps: 'transform' }, 0.7);

  // 3) Ya adentro: el hero presenta título y lema.
  exit.call(finishIntro, [], 1.75);
  // En la misma sesión el portal no se repite (lo lee el script en línea de Base.astro).
  try {
    sessionStorage.setItem('laksmi-intro', '1');
  } catch {}
}
