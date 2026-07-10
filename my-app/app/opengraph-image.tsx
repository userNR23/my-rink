import { ImageResponse } from 'next/og';

export const alt = 'YounHyeRin - Mega Hit Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle, #FFFDF0 20%, #FEF08A 100%)',
        }}
      >
        <div style={{ display: 'flex', gap: 28, fontSize: 64, marginBottom: 36 }}>
          <span>🍉</span>
          <span>🍑</span>
          <span>🫐</span>
          <span>🍓</span>
          <span>🍈</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#FFFDF5',
            border: '6px solid #72D56B',
            borderRadius: 40,
            padding: '48px 96px',
            boxShadow: '0 14px 0 rgba(91,55,29,0.25)',
          }}
        >
          <div style={{ display: 'flex', fontSize: 108, fontWeight: 800, color: '#2b1d0e' }}>
            YounHyeRin
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 16,
              fontSize: 40,
              fontWeight: 700,
              color: '#2F8D39',
              letterSpacing: 4,
            }}
          >
            MEGA HIT ENGINEER
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
