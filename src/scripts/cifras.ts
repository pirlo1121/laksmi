// Comportamiento de Cifras.astro (se carga desde pages/index.astro, en un solo módulo).
import { scene } from '../animations/setup';
import { DUR, EASE } from '../animations/constants';
import { split } from '../animations/reveal';

const root = document.querySelector<HTMLElement>('[data-cifras]')!;

// El latido de la chispa solo corre mientras está en pantalla (ver Cifras.astro).
const spark = root.querySelector<HTMLElement>('.firma__spark')!;
new IntersectionObserver(([e]) => spark.classList.toggle('is-on', e.isIntersecting)).observe(spark);

/** Construye el odómetro de un número: prefijo fijo + una columna giratoria por dígito. */
function buildOdometer(el: HTMLElement) {
  const end = el.dataset.count!;
  const prefix = el.dataset.prefix === '+' ? '+' : '';
  const digits = el.dataset.prefix === '0' ? end.padStart(2, '0') : end;
  const text = `${prefix}${digits}`;
  el.textContent = '';
  el.classList.add('is-odo');
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = text;
  const odo = document.createElement('span');
  odo.className = 'odo';
  odo.setAttribute('aria-hidden', 'true');
  if (prefix) odo.append(Object.assign(document.createElement('span'), { textContent: prefix, className: 'odo__prefix' }));
  const cols = [...digits].map((d, i) => {
    // Da una vuelta completa (más vueltas cuanto más a la derecha) y se detiene en su dígito.
    const laps = 1 + i;
    const seq = [...Array.from({ length: laps * 10 }, (_, k) => k % 10), Number(d)];
    const box = document.createElement('span');
    box.className = 'odo__digit';
    const col = document.createElement('span');
    col.className = 'odo__col';
    seq.forEach((n) => col.append(Object.assign(document.createElement('span'), { textContent: String(n) })));
    box.append(col);
    odo.append(box);
    return { col, steps: seq.length - 1, total: seq.length };
  });
  el.append(sr, odo);
  return cols;
}

scene(2, ({ gsap, c }) => {
  if (c.reduce) return; // valores finales, sin animar

  const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 78%', once: true } });

  // El hilo nace: la partícula aparece y el encabezado sube.
  tl.from(root.querySelector('.firma__spark'), { scale: 0, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.6)' }, 0);
  tl.from(root.querySelectorAll('.firma__head > *'), { autoAlpha: 0, y: 24, duration: DUR.base, ease: EASE.heavy, stagger: 0.1 }, 0.2);

  const cells = [...root.querySelectorAll<HTMLElement>('.cifras__cell')];
  cells.forEach((cell, i) => {
    const at = 0.7 + i * 0.14;
    const num = cell.querySelector<HTMLElement>('.cifras__num')!;
    const bar = cell.querySelector('.cifras__bar');
    const label = cell.querySelector('.cifras__label');

    // La celda sube desde su máscara.
    tl.from(num, { yPercent: 40, autoAlpha: 0, duration: 0.8, ease: EASE.heavy }, at);

    if (num.dataset.count) {
      const cols = buildOdometer(num);
      cols.forEach(({ col, steps, total }, j) => {
        tl.fromTo(
          col,
          { yPercent: 0 },
          { yPercent: (-steps / total) * 100, duration: 1.5 + j * 0.35, ease: 'expo.out' },
          at + 0.05,
        );
      });
    } else {
      // GRATIS: las letras caen girando en 3D, una tras otra.
      const chars = split(num, 'chars', 'cifras__char');
      gsap.set(num, { perspective: 600 });
      tl.from(
        chars,
        { yPercent: 100, rotationX: -90, transformOrigin: '50% 100%', duration: 1, ease: EASE.enter, stagger: 0.06 },
        at + 0.05,
      );
    }

    // Barra Sand que se llena mientras el número gira.
    tl.from(bar, { scaleX: 0, duration: 1.6, ease: 'expo.out' }, at + 0.1);
    tl.from(label, { y: 16, autoAlpha: 0, duration: DUR.base, ease: EASE.heavy }, at + 0.3);
  });
}, root);
