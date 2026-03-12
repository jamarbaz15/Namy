import { ImageResponse } from 'next/og';
import { getListBySlug, NAMES_DB } from '@/data';
import { filterNamesByList } from '@/lib/utils';

export const runtime = 'edge';

const W = 1200;
const H = 720;
const HEADER_H = 90;
const FOOTER_H = 54;
const COL_WRAP_H = H - HEADER_H - FOOTER_H; // 576
const COL_PAD    = 16;
const COL_INNER_H = COL_WRAP_H - COL_PAD * 2;   // 544
const COL_HDR_H   = 54;
const ROW_AREA_H  = COL_INNER_H - COL_HDR_H;     // 490
const MAX_NAMES   = 10;
const ROW_H       = Math.floor(ROW_AREA_H / MAX_NAMES); // 49
// column width: total − side-padding(2×20) − gap(16) divided by 2
const COL_W = Math.floor((W - 40 - 16) / 2); // 572

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const list = getListBySlug(params.slug);
  if (!list) return new Response('Not Found', { status: 404 });

  const allNames   = filterNamesByList(list, NAMES_DB);
  const female     = allNames.filter((n) => n.gender === 'female');
  const male       = allNames.filter((n) => n.gender === 'male');
  const unisex     = allNames.filter((n) => n.gender === 'unisex');

  const leftNames  = (female.length > 0 ? female  : unisex).slice(0, MAX_NAMES);
  const rightNames = (male.length   > 0 ? male    : unisex).slice(0, MAX_NAMES);
  const leftLabel  = female.length > 0 ? '💗  Girl Names'  : '💜  Unisex Names';
  const rightLabel = male.length   > 0 ? '💙  Boy Names'   : '💜  Unisex Names';

  const title      = list.title ?? 'Baby Names';
  const titleSize  = title.length > 52 ? 19 : title.length > 38 ? 22 : title.length > 26 ? 25 : 28;
  const indices    = Array.from({ length: MAX_NAMES }, (_, i) => i);

  return new ImageResponse(
    (
      <div
        style={{
          width: `${W}px`,
          height: `${H}px`,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(150deg, #FFF1F5 0%, #F5F0FF 45%, #EEF5FF 100%)',
          fontFamily: '"Arial", "Helvetica", sans-serif',
        }}
      >

        {/* ══════════ HEADER ══════════ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            height: `${HEADER_H}px`,
            background: 'linear-gradient(90deg, #FF6B8A 0%, #A855F7 50%, #60A5FA 100%)',
            flexShrink: 0,
          }}
        >
          {/* Logo pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              color: '#FF6B8A',
              borderRadius: '100px',
              padding: '7px 20px',
              fontSize: '19px',
              fontWeight: 800,
              flexShrink: 0,
              gap: '6px',
            }}
          >
            🍼 NamyLab
          </div>

          {/* Title */}
          <div
            style={{
              color: 'white',
              fontSize: `${titleSize}px`,
              fontWeight: 800,
              textAlign: 'center',
              flex: 1,
              margin: '0 28px',
              lineHeight: 1.25,
            }}
          >
            {title}
          </div>

          {/* Domain */}
          <div
            style={{
              color: 'rgba(255,255,255,0.72)',
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            namylab.com
          </div>
        </div>

        {/* ══════════ TWO COLUMNS ══════════ */}
        <div
          style={{
            display: 'flex',
            padding: `${COL_PAD}px 20px`,
            gap: '16px',
            height: `${COL_WRAP_H}px`,
            flexShrink: 0,
          }}
        >

          {/* ── GIRLS ── */}
          <div
            style={{
              width: `${COL_W}px`,
              display: 'flex',
              flexDirection: 'column',
              background: 'white',
              borderRadius: '18px',
              border: '1.5px solid #FECDD3',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {/* Column header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: `${COL_HDR_H}px`,
                background: 'linear-gradient(135deg, #FF6B8A 0%, #FBBCCA 100%)',
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'white', fontWeight: 800, fontSize: '21px' }}>
                {leftLabel}
              </span>
            </div>

            {/* Rows */}
            {indices.map((i) => {
              const name = leftNames[i];
              return (
                <div
                  key={`g-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: `${ROW_H}px`,
                    background: i % 2 === 0 ? '#FFF5F7' : '#FFFFFF',
                    borderBottom: '1px solid #FCE7F3',
                    flexShrink: 0,
                  }}
                >
                  {name ? (
                    <span
                      style={{
                        color: '#1F2937',
                        fontSize: '21px',
                        fontWeight: 700,
                      }}
                    >
                      {name.name}
                    </span>
                  ) : (
                    <span style={{ color: '#E5E7EB', fontSize: '16px' }}>—</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── BOYS ── */}
          <div
            style={{
              width: `${COL_W}px`,
              display: 'flex',
              flexDirection: 'column',
              background: 'white',
              borderRadius: '18px',
              border: '1.5px solid #BFDBFE',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {/* Column header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: `${COL_HDR_H}px`,
                background: 'linear-gradient(135deg, #3B82F6 0%, #93C5FD 100%)',
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'white', fontWeight: 800, fontSize: '21px' }}>
                {rightLabel}
              </span>
            </div>

            {/* Rows */}
            {indices.map((i) => {
              const name = rightNames[i];
              return (
                <div
                  key={`b-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: `${ROW_H}px`,
                    background: i % 2 === 0 ? '#EFF6FF' : '#FFFFFF',
                    borderBottom: '1px solid #DBEAFE',
                    flexShrink: 0,
                  }}
                >
                  {name ? (
                    <span
                      style={{
                        color: '#1F2937',
                        fontSize: '21px',
                        fontWeight: 700,
                      }}
                    >
                      {name.name}
                    </span>
                  ) : (
                    <span style={{ color: '#E5E7EB', fontSize: '16px' }}>—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════ FOOTER ══════════ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: `${FOOTER_H}px`,
            background: 'linear-gradient(90deg, #FF6B8A 0%, #A855F7 50%, #60A5FA 100%)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: 'white',
              fontWeight: 600,
              fontSize: '15px',
              letterSpacing: '0.3px',
            }}
          >
            ✨  Top baby names curated by NamyLab  •  namylab.com  ✨
          </span>
        </div>

      </div>
    ),
    { width: W, height: H },
  );
}
