/**
 * Preselección del formulario de contacto.
 * Los botones "Consultar esta área" / "Cotizar mi paquete" llevan data-area / data-paquete
 * y href="#contacto". Al hacer clic se emite `laksmi:preselect`, que escucha ConsultaForm.
 * También se lee la URL (?area=penal&paquete=eps-arl) para enlaces directos.
 */
export interface Preselect {
  area?: string;
  paquete?: string;
}

export const PRESELECT_EVENT = 'laksmi:preselect';

export function emitPreselect(detail: Preselect) {
  document.dispatchEvent(new CustomEvent<Preselect>(PRESELECT_EVENT, { detail }));
}

export function initPreselectLinks() {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-area], [data-paquete]');
    if (!el || el.tagName === 'INPUT') return;
    let paquete = el.dataset.paquete;
    // "Cotizar mi paquete" toma el paquete elegido en las tarjetas.
    if (paquete === 'selected') {
      paquete = document.querySelector<HTMLInputElement>('input[name="paquete-card"]:checked')?.value;
    }
    emitPreselect({ area: el.dataset.area, paquete });
  });
}

export function readPreselectFromUrl(): Preselect {
  const params = new URLSearchParams(location.search);
  return { area: params.get('area') ?? undefined, paquete: params.get('paquete') ?? undefined };
}
