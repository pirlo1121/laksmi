// Equipo. Fuente: laksmi-abogados-datos.md §8.
import type { ImageMetadata } from 'astro';
import alexander from '../assets/team/alexander.jpg';
import sebastian from '../assets/team/sebastian.jpg';
import sarita from '../assets/team/sarita.jpg';
import sofia from '../assets/team/sofia.jpg';

export interface Miembro {
  id: string;
  nombre: string;
  cargo: string;
  foto: ImageMetadata;
  etiquetas: string[];
  /** Vacío = bio [PENDIENTE]; la tarjeta no muestra "Ver perfil". */
  bio: string[];
}

export const equipo: Miembro[] = [
  {
    id: 'alexander',
    nombre: 'Alexander Rivera Díaz',
    cargo: 'Socio Fundador',
    foto: alexander,
    etiquetas: ['Abogado', 'Especialista', 'Profesor Universitario'],
    bio: [
      'Soy abogado y especialista, con experiencia en la Rama Judicial, el litigio y la docencia universitaria. Mi trayectoria profesional me ha permitido conocer el Derecho desde diferentes perspectivas: la administración de justicia, la representación de clientes y la formación de nuevos profesionales.',
      'Durante mi paso por la Rama Judicial adquirí una visión práctica del funcionamiento de los procesos judiciales, fortaleciendo mi capacidad de análisis, interpretación y aplicación del ordenamiento jurídico. Posteriormente, como abogado litigante y asesor jurídico, he acompañado a personas y empresas en la prevención, manejo y solución de conflictos, ofreciendo estrategias legales claras y eficaces.',
      'Como profesor universitario, he contribuido a la formación de futuros abogados, promoviendo el estudio del Derecho con un enfoque práctico, ético y orientado a la resolución de problemas reales.',
      'Mi ejercicio profesional se fundamenta en la responsabilidad, la transparencia y el compromiso con cada cliente. Creo que una asesoría jurídica de calidad no solo consiste en conocer la ley, sino en comprender cada caso, brindar un acompañamiento cercano y construir soluciones que protejan los derechos e intereses de quienes depositan su confianza en mi trabajo.',
      'Mi objetivo es ofrecer un servicio jurídico integral, caracterizado por el profesionalismo, la excelencia y una atención personalizada, buscando siempre la mejor alternativa legal para cada situación.',
    ],
  },
  {
    id: 'sebastian',
    nombre: 'Sebastián Rivera Osorio',
    cargo: 'Socio Fundador',
    foto: sebastian,
    etiquetas: ['Abogado'],
    bio: [
      'Soy abogado con experiencia en el ámbito jurídico, donde he fortalecido mis conocimientos y habilidades en el análisis, asesoría y acompañamiento de asuntos legales. Mi formación y trayectoria me han permitido desarrollar una visión práctica del Derecho, orientada a la búsqueda de soluciones eficaces y al acompañamiento responsable de cada cliente.',
      'A lo largo de mi proceso profesional he participado en el estudio de casos, la elaboración de estrategias jurídicas y el apoyo en diferentes actuaciones legales, consolidando una base sólida para el ejercicio de la profesión. Creo firmemente que el Derecho debe ejercerse con ética, compromiso y responsabilidad, ofreciendo siempre un servicio cercano, transparente y de calidad.',
      'Mi objetivo es brindar una asesoría jurídica integral, fundamentada en el estudio permanente, el análisis riguroso y la atención personalizada, buscando proteger los derechos e intereses de quienes depositan su confianza en mi trabajo. Asumo cada caso con dedicación, profesionalismo y el compromiso de ofrecer soluciones jurídicas claras, oportunas y ajustadas a las necesidades de cada cliente.',
    ],
  },
  { id: 'sarita', nombre: 'Sarita Giraldo', cargo: 'Abogada Senior', foto: sarita, etiquetas: [], bio: [] },
  { id: 'sofia', nombre: 'Sofía Cardona', cargo: 'Abogada Junior', foto: sofia, etiquetas: [], bio: [] },
];
