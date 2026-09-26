// Comportamiento de HoverGlow.astro (se carga desde pages/index.astro, en un solo módulo).
const SELECTOR = '.card, .anode__card, .chap__card, .chap__sigla, .miembro__card, .btn, .hero__chip';

function attach(el: HTMLElement) {
  if (el.querySelector(':scope > .hglow')) return;
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  const glow = document.createElement('span');
  glow.className = 'hglow';
  glow.setAttribute('aria-hidden', 'true');
  el.append(glow);

  let fade = 0;
  const place = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - r.left}px`);
    el.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  el.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'touch') return;
    place(e);
    el.classList.add('is-glow');
  });
  el.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'touch') place(e);
  });
  el.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'touch') el.classList.remove('is-glow');
  });
  // Táctil: un destello breve en el punto tocado.
  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') return;
    place(e);
    el.classList.add('is-glow');
    clearTimeout(fade);
    fade = window.setTimeout(() => el.classList.remove('is-glow'), 650);
  });
}

// No hace falta al arrancar: se prepara en tiempo ocioso para no sumar al montaje inicial.
const init = () => document.querySelectorAll<HTMLElement>(SELECTOR).forEach(attach);
if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(init, { timeout: 2000 });
else setTimeout(init, 300);

export {};
