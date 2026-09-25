// Paquetes de seguridad social. Fuente: laksmi-abogados-datos.md §7 (área 03).

export interface Paquete {
  id: string;
  /** Siglas que componen el paquete; se unen con un "+" en Sand. */
  siglas: string[];
  descripcion: string;
  destacado?: boolean;
  /** [PENDIENTE] precios; si el cliente los entrega van aquí ("desde $X"). */
  precio?: string;
}

export const paquetes: Paquete[] = [
  { id: 'eps-arl', siglas: ['EPS', 'ARL'], descripcion: 'Salud y riesgos laborales' },
  { id: 'eps-arl-afp', siglas: ['EPS', 'ARL', 'AFP'], descripcion: 'Salud, riesgos y pensión' },
  { id: 'eps-arl-ccf', siglas: ['EPS', 'ARL', 'CCF'], descripcion: 'Salud, riesgos y caja de compensación' },
  {
    id: 'eps-arl-afp-ccf',
    siglas: ['EPS', 'ARL', 'AFP', 'CCF'],
    descripcion: 'Cobertura completa',
    destacado: true,
  },
];

export const glosario = [
  { sigla: 'EPS', significado: 'Salud' },
  { sigla: 'ARL', significado: 'Riesgos laborales' },
  { sigla: 'AFP', significado: 'Pensión' },
  { sigla: 'CCF', significado: 'Caja de compensación' },
];

export const nombrePaquete = (p: Paquete) => p.siglas.join(' + ');
