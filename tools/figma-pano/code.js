// lamba pano: pano.json'daki akışı Recime panosunun düzeninde yeni bir sayfaya kurar (T41). Her ekranın altında
// etiket, dört not ve ekibin elle dolduracağı not kutuları var. Var olan sayfalara dokunmaz.

const INK = '#1C1C1F';
const GRAY = '#6B6B73';
const LINE = '#E0E0E5';
const TAGS = {
  AL: ['AL', '#1F8C4D', "MVP'ye alınacak (20 Aralık)"],
  ALMA: ['ALMA', '#C73833', 'alınmayacak (kapsam, kural ya da ton dışı)'],
  SONRAKI: ['SONRAKİ SÜRÜM', '#406BCC', 'Ocak ya da V2'],
  FARK: ['FARK YARATILACAK YER', '#E07A0D', 'rakibin zayıf, bizim öne geçeceğimiz yer'],
  DENENEBILIR: ['DENENEBİLİR', '#8059BF', 'betada denenebilir'],
  BILGI: ['BİLGİ', GRAY, 'bilgi, karar değil'],
};
const NOTES = [
  ['ne', 'Ne:'],
  ['neden', 'Neden böyle?'],
  ['uxui', 'UX / UI:'],
  ['lamba', 'lamba için:'],
];
const PEOPLE = ["Enes'in notu", "Muhammed'in notu"];

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
const solid = (hex) => [{ type: 'SOLID', color: rgb(hex) }];

function box(name, dir, { gap = 0, pad = 0, fill, stroke, radius = 0, width } = {}) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir === 'row' ? 'HORIZONTAL' : 'VERTICAL';
  f.itemSpacing = gap;
  f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = pad;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.fills = fill ? solid(fill) : [];
  if (stroke) {
    f.strokes = solid(stroke);
    f.strokeWeight = 1;
  }
  f.cornerRadius = radius;
  if (width) {
    // resize() iki ekseni de FIXED yapar; yükseklik içeriğe uysun diye eksenler sonra yeniden kurulur.
    f.resize(width, 10);
    f.primaryAxisSizingMode = dir === 'row' ? 'FIXED' : 'AUTO';
    f.counterAxisSizingMode = dir === 'row' ? 'AUTO' : 'FIXED';
  }
  return f;
}

function text(chars, { size = 15, style = 'Regular', color = INK, width, label } = {}) {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style };
  t.fontSize = size;
  t.lineHeight = { value: 140, unit: 'PERCENT' };
  t.fills = solid(color);
  t.characters = label ? `${label} ${chars}` : chars;
  if (label) t.setRangeFontName(0, label.length, { family: 'Inter', style: 'Semi Bold' });
  if (width) {
    t.resize(width, t.height);
    t.textAutoResize = 'HEIGHT';
  } else {
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
  }
  return t;
}

function add(parent, ...children) {
  for (const c of children) parent.appendChild(c);
  return parent;
}

function chip(tagKey) {
  const [label, color] = TAGS[tagKey] || TAGS.BILGI;
  const c = box('Etiket', 'row', { fill: color, radius: 999 });
  c.paddingTop = c.paddingBottom = 4;
  c.paddingLeft = c.paddingRight = 10;
  return add(c, text(label, { size: 12, style: 'Bold', color: '#FFFFFF' }));
}

// Başlıklı beyaz kart; satırlar { label, text } ya da düz metin.
function card(title, rows, { width = 620, fill = '#FFFFFF', titleColor = INK } = {}) {
  const c = box(title, 'column', { gap: 14, pad: 32, fill, stroke: LINE, radius: 24, width });
  add(c, text(title, { size: 24, style: 'Bold', color: titleColor, width: width - 64 }));
  for (const r of rows) {
    const t =
      typeof r === 'string'
        ? text(r, { width: width - 64 })
        : text(r.text, { label: r.label, width: width - 64 });
    add(c, t);
  }
  return c;
}

async function screen(s, images) {
  const col = box(`${s.no} · ${s.name}`, 'column', { gap: 16 });
  add(
    col,
    add(
      box('Başlık', 'row', { gap: 10 }),
      text(s.no, { size: 20, style: 'Bold', color: GRAY }),
      text(s.name, { size: 20, style: 'Semi Bold' }),
    ),
  );

  const img = figma.createImage(images[s.image]);
  const { width, height } = await img.getSizeAsync();
  const r = figma.createRectangle();
  r.name = `Ekran ${s.no}`;
  r.resize(390, Math.round((390 * height) / width));
  r.cornerRadius = 28;
  r.strokes = solid(LINE);
  r.strokeWeight = 1;
  r.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL' }];
  add(col, r, chip(s.tag));

  for (const [key, label] of NOTES) if (s[key]) add(col, text(s[key], { label, width: 390 }));
  for (const who of PEOPLE) {
    const n = box(who, 'column', {
      gap: 6,
      pad: 16,
      fill: '#FFF7E5',
      stroke: '#F0D9A8',
      radius: 16,
      width: 390,
    });
    add(
      n,
      text(who, { size: 13, style: 'Semi Bold', color: '#8A5A00' }),
      text('…', { color: GRAY, width: 358 }),
    );
    add(col, n);
  }
  return col;
}

function intro(p) {
  const g = box('Giriş', 'column', { gap: 24 });
  add(
    g,
    text(p.title, { size: 56, style: 'Bold', width: 720 }),
    text(p.subtitle, { size: 20, color: GRAY, width: 720 }),
  );
  const legend = add(
    box('İşaretler', 'column', { gap: 10 }),
    text('İşaretler', { size: 22, style: 'Semi Bold' }),
  );
  for (const key of Object.keys(TAGS))
    add(legend, add(box('Satır', 'row', { gap: 12 }), chip(key), text(TAGS[key][2], { size: 16 })));
  add(g, legend);
  if (p.intro?.understand?.length)
    add(
      g,
      card(p.intro.understandTitle || `${p.app}'yu anlamak`, p.intro.understand, { width: 722 }),
    );
  return g;
}

function conclusion(c, missing) {
  const g = box(c.title, 'column', { gap: 40 });
  add(
    g,
    add(
      box('Başlık', 'column', { gap: 8 }),
      text(c.title, { size: 40, style: 'Bold' }),
      text(c.subtitle || '', { size: 20, color: GRAY, width: 1800 }),
    ),
  );
  if (c.flow?.length) {
    add(g, text(c.flowTitle || 'Önerilen akış', { size: 28, style: 'Bold' }));
    const flow = box('Akış', 'row', { gap: 16 });
    flow.counterAxisAlignItems = 'CENTER';
    c.flow.forEach((f, i) => {
      if (i) add(flow, text('→', { size: 32, style: 'Bold', color: GRAY }));
      const k = box(f.step, 'column', {
        gap: 10,
        pad: 24,
        fill: '#FFFFFF',
        stroke: LINE,
        radius: 24,
        width: 300,
      });
      add(
        k,
        text(f.step, { size: 20, style: 'Bold', color: '#1F8C4D', width: 252 }),
        text(f.text, { width: 252 }),
      );
      if (f.ref) add(k, text(f.ref, { size: 13, style: 'Semi Bold', color: GRAY, width: 252 }));
      add(flow, k);
    });
    add(g, flow);
  }
  const row = box('Değerlendirme', 'row', { gap: 32 });
  if (c.current?.length) add(row, card('Bugünkü lamba akışı (kodda)', c.current));
  if (c.take?.length) add(row, card('Alınacaklar', c.take, { titleColor: '#1F8C4D' }));
  if (c.skip?.length) add(row, card('Alınmayacaklar', c.skip, { titleColor: '#C73833' }));
  if (c.questionsEnes?.length)
    add(
      row,
      card("Enes'e teknik sorular", c.questionsEnes, { fill: '#FFF7E5', titleColor: '#E07A0D' }),
    );
  if (c.questionsMuhammed?.length)
    add(
      row,
      card("Muhammed'e hukuk ve psikoloji soruları", c.questionsMuhammed, {
        fill: '#F0ECFD',
        titleColor: '#8059BF',
      }),
    );
  if (missing?.length)
    add(row, card('Eksikler: telefonda çekilecek', missing, { fill: '#F8F7F6' }));
  add(g, row);
  return g;
}

function uniquePageName(name) {
  const taken = new Set(figma.root.children.map((p) => p.name));
  if (!taken.has(name)) return name;
  let i = 2;
  while (taken.has(`${name} · ${i}`)) i++;
  return `${name} · ${i}`;
}

async function build(p, images) {
  for (const style of ['Regular', 'Semi Bold', 'Bold'])
    await figma.loadFontAsync({ family: 'Inter', style });
  const page = figma.createPage();
  page.name = uniquePageName(p.pageName || `${p.app} akışı`);
  const root = box(`${p.app} akışı`, 'row', { gap: 160, pad: 120, fill: '#F7F5F0' });
  page.appendChild(root);
  add(root, intro(p));
  let count = 0;
  for (const s of p.sections) {
    const sec = box(s.title, 'column', { gap: 32 });
    add(
      sec,
      add(
        box('Başlık', 'column', { gap: 8 }),
        text(s.title, { size: 40, style: 'Bold' }),
        text(s.subtitle || '', { size: 20, color: GRAY }),
      ),
    );
    const row = box('Ekranlar', 'row', { gap: 48 });
    for (const sc of s.screens) {
      add(row, await screen(sc, images));
      count++;
    }
    add(root, add(sec, row));
  }
  if (p.conclusion) add(root, conclusion(p.conclusion, p.missing));
  await figma.setCurrentPageAsync(page);
  figma.viewport.scrollAndZoomIntoView([root]);
  return { page: page.name, count };
}

figma.showUI(__html__, { width: 380, height: 220 });
figma.ui.onmessage = async (m) => {
  if (m.type !== 'kur') return;
  try {
    const r = await build(m.pano, m.images);
    figma.ui.postMessage({ type: 'bitti', ...r });
    figma.notify(`lamba pano: ${r.count} ekran kuruldu`);
  } catch (e) {
    figma.ui.postMessage({ type: 'hata', message: String(e && e.message ? e.message : e) });
  }
};
