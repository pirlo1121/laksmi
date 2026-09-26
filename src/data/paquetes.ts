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

/** Cada cobertura es una puerta del yantra (n, e, s, w): el paquete enciende las suyas. */
export const glosario = [
  { sigla: 'EPS', significado: 'Salud', puerta: 'n' },
  { sigla: 'ARL', significado: 'Riesgos laborales', puerta: 'e' },
  { sigla: 'AFP', significado: 'Pensión', puerta: 's' },
  { sigla: 'CCF', significado: 'Caja de compensación', puerta: 'w' },
] as const;

/** Puertas que enciende un paquete. */
export const puertas = (p: Paquete) =>
  glosario.filter((g) => p.siglas.includes(g.sigla)).map((g) => g.puerta);

export const nombrePaquete = (p: Paquete) => p.siglas.join(' + ');
