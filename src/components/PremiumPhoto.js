import React from 'react';

/* Fotos editoriais reais; CDN da Unsplash e tamanhos responsivos.
 * Uma única imagem por hero, sem assets 4K carregados em telas pequenas. */
const photos = Object.freeze({
  strength: 'photo-1546817372-628669db4655',
  gym: 'photo-1689877020200-403d8542d95d',
  food: 'photo-1512621776951-a57141f2eefd',
  cardio: 'photo-1534438327276-14e5300c3a48',
  water: 'photo-1518837695005-2083093ee35b',
  goals: 'photo-1517836357463-d25dfeac3438'
});
const widths = [480, 720, 960, 1440, 1920, 2560, 3840];
export default function PremiumPhoto({ scene = 'gym', alt = '', decorative = false, className = '', priority = false }) {
  const id = photos[scene];
  if (!id) return null;
  const src = width => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=82&w=${width}`;
  return <img
    className={['gg-premium-photo',className].filter(Boolean).join(' ')}
    src={src(960)}
    srcSet={widths.map(width => `${src(width)} ${width}w`).join(', ')}
    sizes="(max-width: 600px) 100vw, (max-width: 1100px) 90vw, 1350px"
    alt={decorative ? '' : alt}
    aria-hidden={decorative ? 'true' : undefined}
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : undefined}
    decoding="async"
  />;
}
