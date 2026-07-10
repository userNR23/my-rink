import { readFileSync } from 'fs';
import { join } from 'path';
import { ImageResponse } from 'next/og';

export const alt = 'YounHyeRin - Mega Hit Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function toDataUri(filename: string): string {
  const buffer = readFileSync(join(process.cwd(), 'public', filename));
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

export default function OpengraphImage() {
  const backgroundSrc = toDataUri('og-background.png');
  const logoSrc = toDataUri('title-logo.png');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundSrc}
          width={1200}
          height={630}
          alt=""
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={330}
          height={220}
          alt="YounHyeRin"
          style={{ position: 'absolute', top: 32, left: 32 }}
        />
      </div>
    ),
    { ...size }
  );
}
