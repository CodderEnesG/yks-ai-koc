// Liste, karar ve çıktı denetimi için birim testleri. Kaçırma ve yanlış alarm oranı burada değil, 200
// mesajlık eval setinde (T19) ölçülür.
import { describe, expect, it } from 'vitest';

import { decide } from './decide.ts';
import { LEXICON } from './lexicon.ts';
import { normalize } from './normalize.ts';
import { checkOutput } from './output.ts';
import { screenText } from './screen.ts';

describe('normalize', () => {
  it('Türkçe karakterleri, büyük İ/I harflerini ve noktalamayı katlar', () => {
    expect(normalize('KENDİMİ ÖLDÜRECEĞİM!!!')).toBe('kendimi oldurecegim');
    expect(normalize('Işık, şöyle: çğü')).toBe('isik soyle cgu');
  });

  it('tekrarlanan harfleri ve rakamla yazılanları çözer', () => {
    expect(normalize('ölmeeeek istiyorummm')).toBe('olmek istiyorum');
    expect(normalize('0lmek 1st1yorum')).toBe('olmek istiyorum');
  });
});

describe('screenText', () => {
  it.each([
    ['Kendimi öldüreceğim artık', 'akut', 'kendine_zarar'],
    ['kendimi gerçekten öldürmek istiyorum', 'akut', 'kendine_zarar'],
    ['intihar etcem', 'akut', 'kendine_zarar'],
    ['bütün hapları içip uyuyacağım', 'akut', 'kendine_zarar'],
    ['babam beni dövüyor', 'akut', 'istismar'],
    ['babam her akşam bana vuruyor', 'akut', 'istismar'],
    ['herkes bensiz daha mutlu olur', 'yuksek', 'kendine_zarar'],
    ['ÖLMEK İSTİYORUM', 'yuksek', 'kendine_zarar'],
    ['bazen yaşamak istemiyorum', 'yuksek', 'kendine_zarar'],
    ['ders çalışmak için ritalin aldım', 'yuksek', 'madde'],
    ['kendimi kusturuyorum', 'yuksek', 'yeme'],
  ] as const)('%s → %s', (text, level, category) => {
    const r = screenText(text);
    expect(r.level).toBe(level);
    expect(r.category).toBe(category);
    expect(r.idiom).toBe(false);
  });

  it('akut ile yüksek birlikteyse akut kazanır', () => {
    const r = screenText('ölmek istiyorum, kendimi öldüreceğim');
    expect(r.level).toBe('akut');
    expect(r.matches.length).toBeGreaterThan(1);
  });

  it.each([
    'bu sınav beni öldürecek',
    'kafayı yiyeceğim bu fizikle',
    'yorgunluktan öldüm',
    'matematikte ölüyorum',
  ])('deyim: %s', (text) => {
    const r = screenText(text);
    expect(r.level).toBe('yok');
    expect(r.idiom).toBe(true);
  });

  it.each([
    'kendimi kesinlikle hazır hissediyorum',
    'kendimi asla affetmem bu netle',
    'ölmek istemiyorum, sadece yoruldum',
    'esrarengiz bir paragraf sorusu',
    'bugün 40 test çözdüm',
  ])('risk yok: %s', (text) => {
    const r = screenText(text);
    expect(r.level).toBe('yok');
    expect(r.idiom).toBe(false);
  });

  it('her liste ifadesi kendisiyle eşleşir', () => {
    for (const e of LEXICON) expect(screenText(e.phrase).level, e.phrase).not.toBe('yok');
  });
});

describe('decide', () => {
  const clean = screenText('bugün çok çalıştım');

  it('akut: sabit metin, LLM yok', () => {
    const d = decide(screenText('kendimi öldüreceğim'), { level: 'yok', category: null });
    expect(d).toMatchObject({ level: 'akut', action: 'fixed', sources: ['list'], safeMode: true });
  });

  it('sınıflandırıcı listeyi düşüremez, yükseltebilir', () => {
    expect(decide(screenText('ölmek istiyorum'), { level: 'yok', category: null }).level).toBe(
      'yuksek',
    );
    const d = decide(clean, { level: 'akut', category: 'istismar' });
    expect(d).toMatchObject({ level: 'akut', category: 'istismar', sources: ['classifier'] });
  });

  it('sınıflandırıcı çalışmazsa temiz mesaj da LLM e gitmez', () => {
    expect(decide(clean, null).action).toBe('unavailable');
    expect(decide(screenText('ölmek istiyorum'), null).action).toBe('support');
  });

  it('yalnız deyim: kontrol sorusu, güvenli mod yok', () => {
    const d = decide(screenText('bu sınav beni öldürecek'), { level: 'yok', category: null });
    expect(d).toMatchObject({ level: 'yok', action: 'check', safeMode: false });
  });

  it('deyim ama sınıflandırıcı yüksek: destek', () => {
    const d = decide(screenText('bu sınav beni öldürecek'), {
      level: 'yuksek',
      category: 'kendine_zarar',
    });
    expect(d.action).toBe('support');
  });

  it('risk yok: normal yanıt', () => {
    expect(decide(clean, { level: 'yok', category: null })).toMatchObject({
      level: 'yok',
      category: null,
      action: 'reply',
      sources: [],
      safeMode: false,
    });
  });
});

describe('checkOutput', () => {
  it.each([
    ['Bence sen depresyondasın.', 'teshis'],
    ['Biraz melatonin dene.', 'ilac'],
    ['Diğer öğrenciler senden daha çok çalışıyor.', 'kiyas'],
    ['Kilo vermen gerekebilir.', 'beden'],
    ['Sen tembelsin.', 'asagilama'],
    ['Yapmazsan veline söylerim.', 'tehdit'],
  ] as const)('%s → %s', (text, violation) => {
    expect(checkOutput(text)).toContain(violation);
  });

  it('davranışa yönelik sert ton serbest', () => {
    expect(checkOutput('Bugün iki test eksik kaldı; yarın ilk iş onları bitiriyoruz.')).toEqual([]);
    expect(checkOutput('Erteledin, bunu biliyorsun. 25 dakika aç ve başla.')).toEqual([]);
  });
});
