import { describe, expect, it } from 'vitest';

import { parseIsoDuration, parsePlaylistId, videoUrl } from './index.ts';

const ID = 'PLxA687tYuMWgPS-2u6vQnIw4FWj3_3pbH';

describe('parsePlaylistId', () => {
  it('linkten ve çıplak kimlikten liste kimliğini çıkarır', () => {
    expect(parsePlaylistId(`https://www.youtube.com/playlist?list=${ID}`)).toBe(ID);
    expect(parsePlaylistId(`https://m.youtube.com/watch?v=abc123&list=${ID}&index=2`)).toBe(ID);
    expect(parsePlaylistId(`https://youtu.be/abc123?list=${ID}`)).toBe(ID);
    expect(parsePlaylistId(`youtube.com/playlist?list=${ID}`)).toBe(ID);
    expect(parsePlaylistId(`  ${ID}  `)).toBe(ID);
  });

  it('liste olmayanı reddeder', () => {
    expect(parsePlaylistId('https://www.youtube.com/watch?v=abc123')).toBeNull();
    expect(parsePlaylistId(`https://example.com/playlist?list=${ID}`)).toBeNull();
    expect(parsePlaylistId('merhaba')).toBeNull();
    expect(parsePlaylistId('https://www.youtube.com/playlist?list=<script>')).toBeNull();
  });
});

describe('parseIsoDuration', () => {
  it('saniyeye çevirir', () => {
    expect(parseIsoDuration('PT1H2M3S')).toBe(3723);
    expect(parseIsoDuration('PT45M')).toBe(2700);
    expect(parseIsoDuration('PT30S')).toBe(30);
    expect(parseIsoDuration('P1DT1H')).toBe(90_000);
    expect(parseIsoDuration('P0D')).toBe(0);
  });

  it('geçersizi reddeder', () => {
    expect(parseIsoDuration('')).toBeNull();
    expect(parseIsoDuration('P')).toBeNull();
    expect(parseIsoDuration('PT')).toBeNull();
    expect(parseIsoDuration('1H')).toBeNull();
  });
});

describe('videoUrl', () => {
  it('YouTube adresi verir', () => {
    expect(videoUrl('abc_123-X')).toBe('https://www.youtube.com/watch?v=abc_123-X');
  });
});
