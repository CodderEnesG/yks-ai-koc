import { describe, expect, it } from 'vitest';

import { maskPii } from './pii.ts';
import { RiskSchema } from './risk.ts';

describe('maskPii', () => {
  it.each([
    ['mailim ali.veli@gmail.com', 'mailim [e-posta]'],
    ['beni 0532 123 45 67 den ara', 'beni [telefon] den ara'],
    ['+90 532 1234567', '[telefon]'],
    ['tc 12345678901', 'tc [numara]'],
    ['insta @ayse.yks', 'insta [kullanıcı]'],
    ['Kadıköy Anadolu Lisesi’nde okuyorum', '[okul] okuyorum'],
    ['adım Ayşe Yılmaz, 12. sınıfım', 'adım [ad], 12. sınıfım'],
    ['Ahmet hoca ödev verdi', '[ad] hoca ödev verdi'],
    ["İzmir'de oturuyorum, ISPARTA'ya gideceğim", '[şehir] oturuyorum, [şehir] gideceğim'],
    ['Tokat’tayım', '[şehir]'],
  ])('%s', (input, expected) => {
    expect(maskPii(input)).toBe(expected);
  });

  it('sıradan sözcükle karışan il adı küçük harfle maskelenmez', () => {
    expect(maskPii('babam bana tokat attı, başım ağrıyor')).toBe(
      'babam bana tokat attı, başım ağrıyor',
    );
  });

  it('net, süre ve acil hat numaraları kalır', () => {
    expect(maskPii('bugün 35 net yaptım, 120 dakika çalıştım, 112')).toBe(
      'bugün 35 net yaptım, 120 dakika çalıştım, 112',
    );
  });
});

describe('RiskSchema', () => {
  it('sınıflandırıcı çıktısını doğrular', () => {
    expect(RiskSchema.safeParse({ risk: 'akut', kategori: 'kendine_zarar' }).success).toBe(true);
    expect(RiskSchema.safeParse({ risk: 'yok', kategori: null }).success).toBe(true);
    expect(RiskSchema.safeParse({ risk: 'orta', kategori: null }).success).toBe(false);
  });
});
