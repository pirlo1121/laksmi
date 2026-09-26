// Comportamiento de Nav.astro (se carga desde pages/index.astro, en un solo módulo).
import { lockScroll, scene } from '../animations/setup';

const header = document.querySelector<HTMLElement>('[data-nav]')!;
const burger = header.querySelector<HTMLButtonElement>('[data-burger]')!;
const menu = header.querySelector<HTMLElement>('[data-menu]')!;

/* ---- Menú móvil (funciona sin GSAP) ---- */
function setMenu(open: boolean) {
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menu.hidden = !open;
  lockScroll(open);
  if (open) {
    header.classList.add('is-scrolled');
    menu.querySelector('a')?.focus();
    window.dispatchEvent(new CustomEvent('laksmi:menu-open'));
  } else {
    header.classList.toggle('is-scrolled', window.scrollY > 80);
  }
}
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (e) => {
  if ((e.target as Element).closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !menu.hidden) {
    setMenu(false);
    burger.focus();
  }
});

/* ---- Estado con el scroll ---- */
scene(0, ({ gsap, ScrollTrigger, c }) => {
  const show = gsap.quickTo(header, 'yPercent', { duration: 0.5, ease: 'power3.out' });

  ScrollTrigger.create({
    start: 80,
    end: 'max',
    onUpdate: (self) => {
      if (!menu.hidden) return;
      // Se oculta al bajar y reaparece al subir.
      show(self.direction === 1 && self.scroll() > 240 ? -100 : 0);
    },
    onToggle: (self) => header.classList.toggle('is-scrolled', self.isActive),
  });
  header.classList.toggle('is-scrolled', window.scrollY > 80);

  // Enlace de la sección activa.
  const links = header.querySelectorAll<HTMLAnchorElement>('[data-nav-link]');
  links.forEach((link) => {
    const section = document.getElementById(link.dataset.navLink!);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => link.classList.toggle('is-active', self.isActive),
    });
  });

  // Reveal escalonado del menú móvil.
  const onMenu = () => {
    if (c.reduce) return;
    gsap.from(menu.querySelectorAll('[data-menu-link]'), {
      yPercent: 110,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.06,
    });
  };
  window.addEventListener('laksmi:menu-open', onMenu);
  return () => {
    window.removeEventListener('laksmi:menu-open', onMenu);
    gsap.set(header, { yPercent: 0 });
  };
});
