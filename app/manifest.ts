import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NamyLab - Baby Name Generator',
    short_name: 'NamyLab',
    description: 'Discover the perfect baby name from 100,000+ names. Search by meaning, origin, popularity, and smart tools.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF6B8A',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['lifestyle', 'family', 'utilities'],
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait',
    scope: '/',
  };
}
