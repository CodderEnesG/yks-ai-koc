// Deterministik kriz listesi (rapor 2.10 katman 1). TASLAK: PDR danışmanı (T06) gözden geçirmeden ve
// eval seti (T19) kaçırma oranını ölçmeden yayına çıkmaz. Liste bilerek temkinli: yanlış alarm güvenli
// mod açar (yük hafifler, ton yumuşar); kaçırma ise sınıflandırıcıya kalır.
//
// Yazım: her ifade sözcük köklerinden oluşur; her kök bir sözcüğün başıyla eşleşir ("kendimi öldür" →
// "kendimi öldüreceğim"), kökler arasında en fazla üç sözcük olabilir ("kendimi gerçekten öldürmek").
// İfadeler mesajla aynı normalizasyondan geçer, Türkçe karakterle yazılır.
import type { RiskCategory, RiskLevel } from './types.ts';

export interface LexiconEntry {
  phrase: string;
  level: Exclude<RiskLevel, 'yok'>;
  category: RiskCategory;
}

const acute = (category: RiskCategory, ...phrases: string[]): LexiconEntry[] =>
  phrases.map((phrase) => ({ phrase, level: 'akut', category }));
const high = (category: RiskCategory, ...phrases: string[]): LexiconEntry[] =>
  phrases.map((phrase) => ({ phrase, level: 'yuksek', category }));

export const LEXICON: readonly LexiconEntry[] = [
  // Niyet, plan ya da yöntem: akut.
  ...acute(
    'kendine_zarar',
    'kendimi öldür',
    'intihar ed',
    // "intihar et" tek başına "netlerim intihar etti" gibi deyimleri de tutuyordu (T19 eval); yalnız niyet
    // bildiren çekimler. "intihar ettim/etti" aşağıdaki genel "intihar" ile yüksek kalır.
    'intihar etc',
    'intihar etm',
    'intihar ets',
    'canıma kıy',
    'hayatıma son ver',
    'her şeye son ver',
    'kendimi asac',
    'kendimi asıc',
    'kendimi asmak',
    // "kes" tek başına "kesinlikle"yi de tutar; çekimler ayrı yazılır.
    'bileklerimi kesec',
    'bileklerimi kesic',
    'bileklerimi kesmek',
    'bileğimi kesec',
    'bileğimi kesic',
    'bileğimi kesmek',
    'kendimi kesiyorum',
    'kendimi kesec',
    'kendimi kesic',
    'kendimi kestim',
    'kendimi kesmek',
    'hapları iç',
    'ilaçları iç',
    'bütün hapları',
    'balkondan atla',
    'köprüden atla',
    'camdan atla',
    'kendimi aşağı at',
    'kafama sıkac',
    'kafama sıkıc',
    'kafama sıkmak',
  ),
  // Ölüm isteği, umutsuzluk, kendine zarar sözü: yüksek.
  ...high(
    'kendine_zarar',
    'intihar',
    'ölmek isti',
    'ölmek ister',
    'ölsem kurtul',
    'keşke ölse',
    'yaşamak istemi',
    'yaşamanın anlamı yok',
    'keşke hiç doğmasaydım',
    'ortadan kaybolmak isti',
    'kendime zarar',
    'beni kimse özlemez',
    'ben olmasam daha iyi',
    'bensiz daha iyi',
    'bensiz daha mutlu',
  ),
  ...acute(
    'istismar',
    'beni dövüyor',
    'beni döver',
    'beni dövdü',
    'bana vuruyor',
    'bana vurdu',
    'bana vurur',
    'bana tecavüz',
    'özel yerlerime',
  ),
  ...high('istismar', 'taciz', 'tecavüz', 'bana şiddet', 'beni tehdit ed'),
  ...high(
    'yeme',
    'kendimi kustur',
    'kusturuyorum',
    'günlerdir yemek yemi',
    'günlerdir bir şey yeme',
    'yemek yemeyi bıraktım',
  ),
  ...high(
    'madde',
    'uyuşturucu',
    'esrar iç',
    'esrar kullan',
    'esrar çek',
    'bonzai',
    'ritalin',
    'concerta',
    'modafinil',
    'içmeden duramıyorum',
  ),
];

/**
 * Sınav stresinin deyimleri (rapor 2.10, "Türkçe deyim tuzağı"). Tek başına risk sayılmaz; listedeki bir
 * ifadeyle birlikte değilse alarm yerine nazik bir kontrol sorusu sorulur.
 */
export const IDIOMS: readonly string[] = [
  'beni öldürecek',
  'öldürecek beni',
  'beni öldürür',
  'kafayı yiyec',
  'kafayı yicem',
  'kafayı yiyorum',
  'öleceğim',
  'ölücem',
  'ölüyorum',
  'öldüm',
  'geberiyorum',
  'geberdim',
  'çıldırac',
  'çıldırıc',
  'delirec',
  'delirtec',
  'mahvoldum',
];
