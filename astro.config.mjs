import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://laksmiabogados.com',
  // Fuentes servidas desde el propio sitio (se descargan en el build): sin CSS externo que bloquee
  // el primer pintado y con fallbacks ajustados a sus métricas para que el texto no salte al cargar.
  // Ambas son variables en Google: un solo archivo por estilo cubre todo el rango de pesos.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Manrope',
      cssVariable: '--font-manrope',
      weights: ['400 600'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Red Hat Display',
      cssVariable: '--font-red-hat',
      weights: ['300 900'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
