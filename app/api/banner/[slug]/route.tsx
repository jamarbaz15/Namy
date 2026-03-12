import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';
import { getListBySlug } from '@/data';
import { resolveListTheme, type ListTheme } from '@/lib/listThemes';
import { stripGenderSuffix } from '@/lib/utils';

// Node.js runtime — ImageResponse is fully supported, outputs PNG
// Switched from edge to avoid the 4 MB edge function size limit
export const runtime = 'nodejs';

const W = 1200;
const H = 480;

const FALLBACK: ListTheme = {
  from:  '#FFF5F7',
  to:    '#FFD4DF',
  text:  '#880E4F',
  emoji: '🍼',
  label: 'Baby Names',
};

// hex opacity helpers (theme.text is always a 6-char hex like #880E4F)
// usage: `${theme.text}${A17}` → #880E4F17  (opacity ≈ 0.09)
const A17 = '17'; // 23/255 ≈ 0.09
const A0E = '0E'; // 14/255 ≈ 0.055
const A1A = '1A'; // 26/255 ≈ 0.10
const A47 = '47'; // 71/255 ≈ 0.28

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
  const list  = getListBySlug(params.slug);
  const theme = list ? resolveListTheme(list) : FALLBACK;

  const rawTitle    = stripGenderSuffix(list?.title ?? 'Baby Names');
  const rawCategory = list?.category ?? 'collection';
  const category    = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);

  // Match the font-size tiers from the original SVG route
  const titleSize =
    rawTitle.length > 36 ? 52 :
    rawTitle.length > 26 ? 64 :
    rawTitle.length > 16 ? 76 : 88;

  // ── Right-side circles geometry ──
  // SVG had: cx = W-225 = 975, cy = H/2 = 240
  // Outer  r=185 → 370×370 box  → right: 40,  top: 55
  // Middle r=145 → 290×290 box  → right: 80,  top: 95
  // Inner  r=115 → 230×230 box  → right: 110, top: 125

  return new ImageResponse(
    (
      <div
        style={{
          width:          W,
          height:         H,
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'space-between',
          padding:        '44px 56px',
          background:     `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
          position:       'relative',
          overflow:       'hidden',
        }}
      >
        {/* ── Left accent bar ── */}
        <div style={{
          position:   'absolute',
          left:       0,
          top:        0,
          width:      6,
          height:     H,
          background: `linear-gradient(to bottom, transparent 0%, ${theme.text}${A47} 40%, ${theme.text}${A47} 60%, transparent 100%)`,
          display:    'flex',
        }} />

        {/* ── Right decoration: outer ring ── */}
        <div style={{
          position:     'absolute',
          right:        40,
          top:          55,
          width:        370,
          height:       370,
          borderRadius: '50%',
          border:       `2px solid ${theme.text}${A17}`,
          display:      'flex',
        }} />

        {/* ── Right decoration: middle filled circle ── */}
        <div style={{
          position:     'absolute',
          right:        80,
          top:          95,
          width:        290,
          height:       290,
          borderRadius: '50%',
          background:   `${theme.text}${A0E}`,
          display:      'flex',
        }} />

        {/* ── Right decoration: inner ring ── */}
        <div style={{
          position:     'absolute',
          right:        110,
          top:          125,
          width:        230,
          height:       230,
          borderRadius: '50%',
          border:       `2px solid ${theme.text}${A1A}`,
          display:      'flex',
        }} />

        {/* ── Right decoration: emoji centred in the circles ── */}
        <div style={{
          position:       'absolute',
          right:          40,
          top:            55,
          width:          370,
          height:         370,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       118,
          lineHeight:     1,
        }}>
          {theme.emoji}
        </div>

        {/* ── Corner glow — top right ── */}
        <div style={{
          position:     'absolute',
          right:        -60,
          top:          -60,
          width:        340,
          height:       340,
          borderRadius: '50%',
          background:   `${theme.text}0A`,
          display:      'flex',
        }} />

        {/* ── Top row: NamyLab pill + category pill ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background:   '#FF6B8A',
            color:        'white',
            borderRadius: 18,
            padding:      '8px 20px',
            fontSize:     16,
            fontWeight:   700,
            display:      'flex',
          }}>
            NamyLab
          </div>
          <div style={{
            background:    `${theme.text}1A`,
            color:         theme.text,
            borderRadius:  18,
            padding:       '8px 14px',
            fontSize:      12,
            fontWeight:    700,
            letterSpacing: '2.5px',
            display:       'flex',
          }}>
            {category.toUpperCase()}
          </div>
        </div>

        {/* ── Middle: title + accent underline ── */}
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           14,
          maxWidth:      680,
        }}>
          <div style={{
            fontSize:      titleSize,
            fontWeight:    900,
            color:         theme.text,
            lineHeight:    1.1,
            letterSpacing: -1,
            display:       'flex',
            flexWrap:      'wrap',
          }}>
            {rawTitle}
          </div>

          {/* Three-dot accent underline */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 48, height: 4, borderRadius: 2, background: `${theme.text}80`, display: 'flex' }} />
            <div style={{ width: 14, height: 4, borderRadius: 2, background: `${theme.text}40`, display: 'flex' }} />
            <div style={{ width: 6,  height: 4, borderRadius: 2, background: `${theme.text}1F`, display: 'flex' }} />
          </div>
        </div>

        {/* ── Bottom: tagline ── */}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        8,
          fontSize:   18,
          color:      `${theme.text}A6`,
          fontWeight: 400,
        }}>
          <span style={{ display: 'flex' }}>{theme.emoji}</span>
          <span style={{ display: 'flex', marginLeft: 8 }}>Meanings</span>
          <span style={{ display: 'flex', color: `${theme.text}59`, fontSize: 13 }}>•</span>
          <span style={{ display: 'flex' }}>Origins</span>
          <span style={{ display: 'flex', color: `${theme.text}59`, fontSize: 13 }}>•</span>
          <span style={{ display: 'flex' }}>Popularity</span>
          <span style={{ display: 'flex', marginLeft: 14, fontSize: 15, color: `${theme.text}73` }}>namylab.com</span>
        </div>

      </div>
    ),
    {
      width:  W,
      height: H,
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    },
  );
  } catch (error) {
    console.error('Error generating banner:', error);
    return new Response('Error generating banner', { status: 500 });
  }
}
