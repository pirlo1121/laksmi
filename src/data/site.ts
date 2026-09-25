// Identidad, contacto y SEO. Fuente: laksmi-abogados-datos.md §1, §5, §10.

export const site = {
  nombre: 'LAKSMI ABOGADOS',
  lema: 'Estamos de su lado',
  marca: 'Su aliado y su apoyo en todo momento y territorio.',
  ciudad: 'Bogotá · Colombia',
  // [PENDIENTE] validar con el cliente; alternativa con copy existente: "Estamos de su lado."
  fraseHero: 'Usted no está solo frente a la ley.',
  url: 'https://laksmiabogados.com',
  locale: 'es_CO',
  themeColor: '#0A0E15',
};

export const seo = {
  title: 'LAKSMI ABOGADOS — Derecho Laboral, Civil-Familia, Seguridad Social y Penal · Bogotá',
  description:
    'LAKSMI ABOGADOS — firma de abogados en Bogotá: derecho laboral y empresarial, civil y familia, seguridad social (EPS, ARL, AFP, CCF) y derecho penal. Primera consulta gratis.',
  ogTitle: 'LAKSMI ABOGADOS — Abogados en Bogotá · Primera consulta gratis',
};

export const contacto = {
  whatsapp: '+57 314 390 3809',
  whatsappNumero: '573143903809',
  whatsappLink: 'https://wa.me/573143903809',
  // [PENDIENTE] correo corporativo; se mantiene Gmail hasta que el cliente confirme.
  email: 'laksmiabogados@gmail.com',
  direccion: 'Cra 15 #124-17, Edificio Jorge Barón TV, Torre B, Of. 306',
  referencia: 'Frente a Unicentro',
  ciudad: 'Bogotá D.C., Colombia',
  horarios: [
    { dias: 'Lun – Vie', horas: '9:00 – 18:00' },
    { dias: 'Sáb', horas: '9:00 – 16:00' },
  ],
  horarioNota: 'Jornada continua',
  // [PENDIENTE] confirmar la ubicación exacta para el mapa.
  mapaQuery: 'Cra 15 #124-17, Bogotá',
};

export const redes = [
  { nombre: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61560334198836' },
  { nombre: 'Instagram', url: 'https://www.instagram.com/laksmiabogadosbog' },
  { nombre: 'TikTok', url: 'https://www.tiktok.com/@laksmiabogados' },
];

export const nav = [
  { label: 'Áreas', href: '#areas' },
  { label: 'Seguridad Social', href: '#paquetes' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Contacto', href: '#contacto' },
];

// [PENDIENTE] confirmar +15 y +100 con el cliente antes de publicar.
export const cifras = [
  { valor: 4, prefijo: '0', texto: null, etiqueta: 'Áreas del derecho' },
  { valor: null, prefijo: '', texto: 'GRATIS', etiqueta: 'Primera consulta' },
  { valor: 15, prefijo: '+', texto: null, etiqueta: 'Años de experiencia' },
  { valor: 100, prefijo: '+', texto: null, etiqueta: 'Casos atendidos' },
] as const;
