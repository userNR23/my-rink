import { readFileSync } from 'fs';
import { join } from 'path';
import { ImageResponse } from 'next/og';

export const alt = 'YounHyeRin - Mega Hit Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const logoBuffer = readFileSync(join(process.cwd(), 'public', 'title-logo.png'));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`;

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
        <div style={{ display: 'flex', gap: 28, fontSize: 56, marginBottom: 24 }}>
          <span>🍉</span>
          <span>🍑</span>
          <span>🫐</span>
          <span>🍓</span>
          <span>🍈</span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={680} height={453} alt="YounHyeRin" />
      </div>
    ),
    { ...size }
  );
}
