// Las cuatro áreas = las cuatro puertas del yantra. Fuente: laksmi-abogados-datos.md §7.

export type Gate = 'n' | 'e' | 's' | 'w';

export interface Area {
  id: string;
  numero: string;
  nombre: string;
  /** Título partido en dos líneas: la primera en 900, la segunda en 300 itálica. */
  titulo: [string, string];
  resumen: string;
  grupos: { titulo: string; servicios: string[] }[];
  /** Puerta del yantra que queda mirando al contenido cuando el área está activa. */
  gate: Gate;
  /** Rotación del yantra (grados) para llevar esa puerta a la derecha. */
  rotacion: number;
  destacada?: boolean;
}

export const areas: Area[] = [
  {
    id: 'laboral',
    numero: '01',
    nombre: 'Laboral y Empresarial',
    titulo: ['Laboral y', 'Empresarial'],
    resumen:
      'Protegemos al trabajador y blindamos a la empresa: asesorías, litigios, contratos, liquidaciones y formalización.',
    grupos: [
      {
        titulo: 'Laboral',
        servicios: [
          'Asesorías jurídicas en derecho laboral',
          'Acompañamiento jurídico en procesos litigiosos',
          'Redacción de contratos',
          'Debido proceso para contratar y desvincular empleados',
          'Despido sin justa causa',
          'Acoso laboral y vulneración de derechos',
          'Liquidación de prestaciones sociales',
          'Constitución de reglamento interno de trabajo',
        ],
      },
      {
        titulo: 'Empresarial',
        servicios: [
          'Constitución y formalización de empresas',
          'Acompañamiento jurídico en procesos litigiosos',
          'Registro de marca ante la Superintendencia de Industria y Comercio',
          'Blindaje legal para empresas',
        ],
      },
    ],
    gate: 'e',
    rotacion: 0,
  },
  {
    id: 'civil',
    numero: '02',
    nombre: 'Civil y Familia',
    titulo: ['Civil y', 'Familia'],
    resumen:
      'Patrimonio, sucesiones, divorcios, custodia y procesos civiles. Acompañamiento humano y firme en lo que más importa.',
    grupos: [
      {
        titulo: 'Familia',
        servicios: [
          'Organización del patrimonio',
          'Sucesiones y testamentos',
          'Divorcios',
          'Liquidación de sociedades conyugales y patrimoniales',
          'Demanda de alimentos',
          'Custodia y patria potestad',
        ],
      },
      {
        titulo: 'Civil',
        servicios: [
          'Procesos de pertenencia · prescripción adquisitiva de dominio',
          'Responsabilidad civil contractual y extracontractual',
          'Procesos ejecutivos (títulos valores)',
        ],
      },
    ],
    gate: 's',
    rotacion: -90,
  },
  {
    id: 'seguridad-social',
    numero: '03',
    nombre: 'Seguridad Social',
    titulo: ['Seguridad', 'Social'],
    resumen:
      'Afiliaciones y aportes sin trámites eternos: EPS, ARL, AFP y CCF en paquetes claros para usted y sus empleados.',
    grupos: [],
    gate: 'w',
    rotacion: -180,
    destacada: true,
  },
  {
    id: 'penal',
    numero: '04',
    nombre: 'Derecho Penal',
    titulo: ['Derecho', 'Penal'],
    resumen:
      'Defensa técnica en procesos penales, denuncias, querellas, audiencias y apelaciones. Su defensa, con total confidencialidad.',
    grupos: [
      {
        titulo: 'Defensa y representación',
        servicios: [
          'Defensa en procesos penales',
          'Asistencia en audiencias',
          'Denuncias y querellas',
          'Recursos y apelaciones',
        ],
      },
      {
        titulo: 'Casos que atendemos',
        servicios: [
          'Delitos sexuales',
          'Violencia intrafamiliar',
          'Estafa, fraude y abuso de confianza',
          'Lesiones personales',
        ],
      },
    ],
    gate: 'n',
    rotacion: -270,
  },
];
