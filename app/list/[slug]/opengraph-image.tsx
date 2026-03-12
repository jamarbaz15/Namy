import { ImageResponse } from 'next/og';
import { getListBySlug, NAMES_DB } from '@/data';
import { filterNamesByList } from '@/lib/utils';
import { resolveListTheme } from '@/lib/listThemes';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage({ params }: { params: { slug: string } }) {
  const list = getListBySlug(params.slug);

  const title   = list?.title    ?? 'Baby Names';
  const category = list?.category ?? 'Collection';
  const theme   = list ? resolveListTheme(list) : { from: '#FFF5F7', to: '#FFD4DF', text: '#880E4F', emoji: '🍼', label: 'Baby Names' };
  const count   = list ? filterNamesByList(list, NAMES_DB).length : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Giant faded emoji */}
        <div
          style={{
            position: 'absolute',
            right: '48px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '280px',
            opacity: 0.13,
            lineHeight: 1,
          }}
        >
          {theme.emoji}
        </div>

        {/* Top: NamyLab pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: '#FF6B8A',
              color: 'white',
              borderRadius: '100px',
              padding: '10px 28px',
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '-0.3px',
            }}
          >
            NamyLab
          </div>
          <div
            style={{
              background: `${theme.text}18`,
              color: theme.text,
              borderRadius: '100px',
              padding: '10px 20px',
              fontSize: '20px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            {theme.label}
          </div>
        </div>

        {/* Middle: big emoji + title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' }}>
          <div style={{ fontSize: '72px', lineHeight: 1 }}>{theme.emoji}</div>
          <div
            style={{
              fontSize: title.length > 32 ? '56px' : '68px',
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: count + site */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '26px', color: `${theme.text}BB`, fontWeight: 600 }}>
            {count > 0 ? `${count}+ curated names` : 'Baby names with meanings & origins'}
          </div>
          <div style={{ fontSize: '22px', color: `${theme.text}88`, fontWeight: 500 }}>
            namylab.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
