// verify-v1.mjs — news-image-20261120 gate checks (written from scratch).
// Pure Node, no dependencies. Run: node verify-v1.mjs
// Exit 0 only when every check passes.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const DIR = path.dirname(new URL(import.meta.url).pathname);
const PNG = path.join(DIR, 'entry-final-v1.png');
const SVG = path.join(DIR, 'entry-v1.svg');
const DATA = path.join(DIR, 'news-v1.json');
const GEN = path.join(DIR, 'generate-v1.mjs');
const MAX_BYTES = 307200;

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`PASS  ${name}${detail ? ' — ' + detail : ''}`); }
  else { fail++; console.log(`FAIL  ${name}${detail ? ' — ' + detail : ''}`); }
};
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const png = fs.readFileSync(PNG);
const svg = fs.readFileSync(SVG, 'utf8');

// ------------------------------------------------------------ 1. size + PNG
ok('size <= 307200 B', png.length <= MAX_BYTES, `${png.length} B`);
ok('PNG signature', png.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])));
const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
ok('dimensions 1024x1024', w === 1024 && h === 1024, `${w}x${h}`);
ok('color type RGB (2)', png[25] === 2, `type ${png[25]}`);
ok('bit depth 8', png[24] === 8, `depth ${png[24]}`);

// PNG chunk CRCs (integrity: every chunk checksummed and complete)
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
{
  let off = 8, chunks = [], good = true, sawIEND = false;
  while (off + 8 <= png.length) {
    const len = png.readUInt32BE(off);
    const type = png.toString('ascii', off + 4, off + 8);
    if (off + 12 + len > png.length) { good = false; break; }
    const stored = png.readUInt32BE(off + 8 + len);
    const calc = crc32(png.subarray(off + 4, off + 8 + len));
    if (stored !== calc) good = false;
    chunks.push(type);
    if (type === 'IEND') { sawIEND = true; off += 12 + len; break; }
    off += 12 + len;
  }
  ok('PNG chunks valid + IEND present', good && sawIEND && off === png.length, chunks.join(','));
}

// ------------------------------------------------------- 2. determinism
{
  const a = path.join(DIR, '.verify-a.png'), b = path.join(DIR, '.verify-b.png');
  const sa = path.join(DIR, '.verify-a.svg'), sb = path.join(DIR, '.verify-b.svg');
  try {
    execFileSync('node', [GEN, DATA, a, sa], { cwd: DIR, stdio: 'pipe' });
    execFileSync('node', [GEN, DATA, b, sb], { cwd: DIR, stdio: 'pipe' });
    const ha = sha(fs.readFileSync(a)), hb = sha(fs.readFileSync(b)), he = sha(png);
    ok('determinism: 2 runs byte-identical', ha === hb, `${ha.slice(0, 12)}…`);
    ok('determinism: runs match entry-final-v1.png', ha === he, `entry ${he.slice(0, 12)}…`);
    ok('determinism: SVG identical across runs', fs.readFileSync(sa, 'utf8') === fs.readFileSync(sb, 'utf8'));
  } finally {
    for (const f of [a, b, sa, sb]) try { fs.unlinkSync(f); } catch { /* already gone */ }
  }
}

// ------------------------------------------------------- 3. truncation
ok('no ellipsis character anywhere', !svg.includes('…'));
{
  // Hero headlines wrap onto two <text> lines; check against the poster's
  // visible text (all <text> contents joined with spaces, whitespace folded).
  const visible = [...svg.matchAll(/>([^<]+)<\/text>/g)].map((m) => m[1]).join(' ').replace(/\s+/g, ' ');
  const all = [
    ...data.heroes.map((x) => x.headline),
    ...data.grid.map((x) => x.headline),
    ...data.brief.map((x) => x.headline),
  ];
  const missing = all.filter((t) => !visible.includes(t));
  ok('all 33 headlines present verbatim', missing.length === 0, missing.length ? `missing: ${missing.join(' | ')}` : '33/33');
  const deks = data.heroes.map((x) => x.dek);
  const missingDek = deks.filter((t) => !visible.includes(t));
  ok('all 3 hero deks present', missingDek.length === 0);
}

// ------------------------------------------------------- 4. content counts
ok('heroes 3', data.heroes.length === 3);
ok('grid 10', data.grid.length === 10);
ok('briefs 20', data.brief.length === 20);
ok('total stories 33', data.heroes.length + data.grid.length + data.brief.length === 33);
ok('map pins 9/9', (svg.match(/class="pin"/g) || []).length === 9, `${(svg.match(/class="pin"/g) || []).length} pins`);
ok('map grey dots 12', (svg.match(/class="dot"/g) || []).length === 12, `${(svg.match(/class="dot"/g) || []).length} dots`);
ok('timeline 6 slots', (svg.match(/class="tl"/g) || []).length === 6, `${(svg.match(/class="tl"/g) || []).length} slots`);
{
  const times = data.timeline.every((t) => svg.includes(`data-time="${esc(t.time)}"`) && svg.includes(`data-label="${esc(t.label)}"`));
  ok('timeline times + labels present', times);
}
ok('DATE CHECK present', svg.includes('DATE CHECK'));
ok('DATE CHECK "Not yet:" line present', svg.includes('Not yet:'));
ok('DATE CHECK names 19 Nov exclusions', ['Shenzhen summit', 'ICJ ruling', 'Anthropic debut', 'Rose pardon'].every((s) => svg.includes(s)));
ok('"Not yet" names 21 Nov events', svg.includes('MAMA Chapter 2') && svg.includes('NROL-136') && svg.includes('12:30 UTC'));
ok('status chips on 3/3 heroes', (svg.match(/CONFIRMED · /g) || []).length === 3);
ok('HOW SURE legend present', svg.includes('HOW SURE ARE WE?') && svg.includes('CLAIM = one side'));
ok('"Original drawings" in footer', svg.includes('Original drawings'));
{
  const sources = ['Reuters', 'AP', 'AFP', 'BBC', 'The Hindu', 'IMD', 'Bloomberg', 'NWS', 'NHC'];
  const missingSrc = sources.filter((s) => !svg.includes(s));
  ok('footer sources 9/9', missingSrc.length === 0, missingSrc.length ? `missing: ${missingSrc.join(', ')}` : '9/9');
}

// ------------------------------------------------------- 5. contrast (WCAG)
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
for (const [name, fg, bg] of [
  ['INK on PAPER', '#2B2117', '#F2E7D0'],
  ['MUTED on PAPER', '#6E5C46', '#F2E7D0'],
  ['ACCENT on PAPER', '#A9341F', '#F2E7D0'],
  ['white on ACCENT', '#FFFFFF', '#A9341F'],
  ['white on INK', '#FFFFFF', '#2B2117'],
]) {
  const r = ratio(fg, bg);
  ok(`contrast ${name} >= 4.5:1`, r >= 4.5, `${r.toFixed(2)}:1`);
}

// ------------------------------------------------------- 6. fit (width model)
// Same conservative advance model as the generator: average glyph advance
// as a fraction of font size (Playfair 0.55, Noto Sans 0.52, bold 0.62).
const estW = (s, size, f) => s.length * size * f * 1.06;
{
  const slotW = 968 / 6;
  const bad = data.timeline.filter((t) => estW(t.time, 11, 0.62) + 6 + estW(t.label, 11, 0.52) > slotW);
  ok('timeline slots fit their columns', bad.length === 0, bad.length ? bad.map((t) => t.time).join(',') : '6/6 fit');
  const badBrief = data.brief.filter((b) => b.headline.length > 31 || estW(b.headline, 11.5, 0.52) > 222);
  ok('brief headlines <= 31 chars and fit column', badBrief.length === 0, badBrief.length ? badBrief.map((b) => b.n).join(',') : '20/20 fit');
  const badGrid = data.grid.filter((g) => estW(g.headline, 16, 0.55) > 420);
  ok('grid headlines fit one line', badGrid.length === 0, badGrid.length ? badGrid.map((g) => g.n).join(',') : '10/10 fit');
  const badHero = data.heroes.filter((x) => estW(x.headline, 22, 0.55) > 312 * 2);
  ok('hero headlines fit two lines', badHero.length === 0);
  ok('masthead fits width', estW(data.date, 62, 0.55) <= 968, `${Math.round(estW(data.date, 62, 0.55))}px est.`);
  ok('dek fits width', estW(data.dek, 17, 0.52) <= 968, `${Math.round(estW(data.dek, 17, 0.52))}px est.`);
  const dc1 = estW(data.dateCheck, 11.5, 0.62), dc2 = estW(`Not yet: ${data.notYet}`, 11.5, 0.62);
  ok('DATE CHECK lines fit box', dc1 <= 944 && dc2 <= 944, `${Math.round(dc1)}/${Math.round(dc2)}px of 944`);
}

// ------------------------------------------------------- 7. stats / regions
{
  const statsOk = data.stats.length === 6 && data.stats.every((s) => s.num && s.label);
  ok('stat strip 6 entries', statsOk);
  const regionSum = data.regionBar.reduce((a, r) => a + r.count, 0);
  ok('region bar sums to 32 (33rd is off-continent USSF-317)', regionSum === 32, `sum ${regionSum}`);
}

console.log(`\n${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
