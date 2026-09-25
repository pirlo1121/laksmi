// [PENDIENTE] confirmar que las reseñas son reales, que los autores autorizan su uso
// y el enlace a la fuente (Google Business o Facebook). Fuente: laksmi-abogados-datos.md §9.

export interface Testimonio {
  autor: string;
  texto: string;
  fuente?: string;
}

export const testimonios: Testimonio[] = [
  {
    autor: 'Clara Paola Cruz',
    texto:
      'Excelente servicio de los abogados de Laksmi, me ayudaron a solucionar un problema legal que tenía hace años, los recomiendo.',
  },
  {
    autor: 'Andrés López Murcia',
    texto:
      'Soy cliente desde hace 3 años de Laksmi y me ha funcionado mucho, especialmente como asesores de mi empresa, donde me asesoran en derecho laboral sobre cómo debo hacer contrataciones.',
  },
  {
    autor: 'Hanna Galvis',
    texto: 'Son muy buenos, siempre que necesito una asesoría en derecho laboral me han servido demasiado.',
  },
  {
    autor: 'Carlos Cortés',
    texto:
      'Me gusta que a través de Laksmi me he podido afiliar a Seguridad Social, al igual que he podido afiliar a los empleados de mi negocio.',
  },
];
