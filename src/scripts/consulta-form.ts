// Comportamiento de ConsultaForm.astro (se carga desde pages/index.astro, en un solo módulo).
import { areas } from '../data/areas';
import { nombrePaquete, paquetes } from '../data/paquetes';
import { contacto } from '../data/site';
import { initPreselectLinks, PRESELECT_EVENT, readPreselectFromUrl, type Preselect } from './preselect';

const form = document.querySelector<HTMLFormElement>('[data-form]')!;
const area = form.querySelector<HTMLSelectElement>('#f-area')!;
const paquete = form.querySelector<HTMLSelectElement>('#f-paquete')!;
const paqueteRow = form.querySelector<HTMLElement>('[data-paquete-row]')!;
const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
const SS = 'seguridad-social';

function syncPaquete() {
  paqueteRow.hidden = area.value !== SS;
}
area.addEventListener('change', syncPaquete);

function pulse(el: HTMLElement) {
  el.classList.remove('is-pulsing');
  void el.offsetWidth;
  el.classList.add('is-pulsing');
}

function preselect({ area: a, paquete: p }: Preselect) {
  if (a && areas.some((x) => x.id === a)) {
    area.value = a;
    pulse(area);
  }
  syncPaquete();
  if (p && paquetes.some((x) => x.id === p)) {
    paquete.value = p;
    pulse(paquete);
  }
}

initPreselectLinks();
document.addEventListener(PRESELECT_EVENT, (e) => preselect((e as CustomEvent<Preselect>).detail));
preselect(readPreselectFromUrl());

/* ---- Validación nativa con mensajes anunciados ---- */
const messages: Record<string, string> = {
  area: 'Elija el área de su consulta.',
  nombre: 'Escriba su nombre.',
  correo: 'Escriba un correo válido.',
  celular: 'Escriba un número de celular válido.',
  datos: 'Debe autorizar el tratamiento de sus datos para continuar.',
};

function validate(field: HTMLInputElement | HTMLSelectElement) {
  const err = document.getElementById(`${field.id}-err`);
  if (!err) return true;
  const ok = field.checkValidity();
  field.setAttribute('aria-invalid', String(!ok));
  err.textContent = ok ? '' : messages[field.name] ?? field.validationMessage;
  return ok;
}

const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]')];
fields.forEach((f) =>
  f.addEventListener(f.type === 'checkbox' || f.tagName === 'SELECT' ? 'change' : 'blur', () => {
    if (f.getAttribute('aria-invalid') || f.value) validate(f);
  }),
);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const invalid = fields.filter((f) => !validate(f));
  if (invalid.length) {
    invalid[0].focus();
    return;
  }

  // Plantilla de laksmi-abogados-datos.md §11.
  const data = new FormData(form);
  const areaNombre = areas.find((a) => a.id === data.get('area'))?.nombre ?? '';
  const paq = paquetes.find((p) => p.id === data.get('paquete'));
  const lines = [
    'Hola LAKSMI Abogados, quiero agendar mi consulta gratis.',
    `Área: ${areaNombre}`,
    area.value === SS && paq ? `Paquete: ${nombrePaquete(paq)}` : null,
    `Nombre: ${data.get('nombre')}`,
    `Correo: ${data.get('correo')}`,
    `Celular: ${data.get('celular')}`,
    String(data.get('mensaje') ?? '').trim() ? `Caso: ${String(data.get('mensaje')).trim()}` : null,
  ].filter(Boolean);

  window.open(
    `https://wa.me/${contacto.whatsappNumero}?text=${encodeURIComponent(lines.join('\n'))}`,
    '_blank',
    'noopener',
  );

  const label = submit.textContent;
  submit.textContent = 'Abriendo WhatsApp…';
  submit.disabled = true;
  setTimeout(() => {
    submit.textContent = label;
    submit.disabled = false;
  }, 2500);
});
