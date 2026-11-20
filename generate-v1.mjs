// generate-v1.mjs — news-image-20261120 poster generator (written from scratch).
// Reads news-v1.json (verified 20 Nov stories), renders a 1024x1024 SVG with
// @resvg/resvg-js, then writes a deterministic RGB PNG (zlib level 9).
// Usage: node generate-v1.mjs news-v1.json entry-final-v1.png entry-v1.svg
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { Resvg } from '@resvg/resvg-js';

const [dataPath, pngOut, svgOut] = process.argv.slice(2);
if (!dataPath || !pngOut) {
  console.error('usage: node generate-v1.mjs <news-v1.json> <out.png> [out.svg]');
  process.exit(1);
}
const DIR = path.dirname(new URL(import.meta.url).pathname);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// ---------------------------------------------------------------- palette
const PAPER = '#F2E7D0';   // cream paper
const CARD  = '#FBF4E3';   // lighter card
const INK   = '#2B2117';   // near-black brown
const MUTED = '#6E5C46';   // warm grey-brown
const ACCENT = '#A9341F';  // brick red
const TEAL  = '#4F7A6F';   // dusty teal
const TERRA = '#C06B45';   // soft terracotta
const GREEN = '#5C7A4C';   // banana-leaf green
const GOLD  = '#C99A3C';   // muted gold
const SAGE  = '#7C9A6B';   // map land
const SEA   = '#EFE4CB';   // map sea
const GREY  = '#8A8378';   // grey dots

// ------------------------------------------------------- text width model
// Average glyph advance as a fraction of font size, calibrated against the
// real TTFs with PIL (Playfair Black ~0.50, Noto Sans ~0.48, caps ~0.64).
// A 1.06 safety factor keeps wrapped lines inside their boxes.
const CW = { playfair: 0.55, sans: 0.52, sansBold: 0.62, serifIt: 0.52 };
const textW = (s, size, kind, ls = 0) =>
  Math.round(s.length * size * CW[kind] * 1.06 + Math.max(0, s.length - 1) * ls);

function wrap(text, maxW, size, kind, ls = 0, maxLines = 2) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (textW(t, size, kind, ls) <= maxW || !cur) cur = t;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    throw new Error(`wrap overflow (${lines.length} lines > ${maxLines}): "${text}"`);
  }
  return lines;
}

// ------------------------------------------------------------ svg builder
const S = [];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Registry of placed text boxes; any two overlapping boxes abort the build.
const boxes = [];
function place(x, baseline, w, size, label) {
  const b = { x, y: baseline - size * 0.72, w, h: size * 0.9, label };
  for (const o of boxes) {
    if (b.x < o.x + o.w && o.x < b.x + b.w && b.y < o.y + o.h && o.y < b.y + b.h) {
      throw new Error(`text overlap: "${label}" vs "${o.label}"`);
    }
  }
  boxes.push(b);
  return b;
}
const rect = (x, y, w, h, fill, extra = '') =>
  S.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`);
const line = (x1, y1, x2, y2, stroke, w = 1) =>
  S.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"/>`);
const circ = (cx, cy, r, fill, extra = '') =>
  S.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`);
const poly = (pts, fill, extra = '') =>
  S.push(`<polygon points="${pts}" fill="${fill}" ${extra}/>`);
function text(x, y, str, size, fill, family, weight = 400, anchor = 'start', ls = 0, style = '') {
  const kind = family === 'pf' ? 'playfair' : weight >= 700 ? 'sansBold' : 'sans';
  const w = textW(str, size, kind, ls);
  const bx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  place(bx, y, w, size, str.slice(0, 40));
  const fam = family === 'pf' ? 'Playfair Display' : family === 'serif' ? 'Noto Serif' : 'Noto Sans';
  S.push(`<text x="${x}" y="${y}" font-family="${fam}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${ls ? ` letter-spacing="${ls}"` : ''}${style ? ` font-style="${style}"` : ''}>${esc(str)}</text>`);
  return w;
}

// ------------------------------------------------------------------ layout
const M = 28;            // side margin
const X1 = 996;          // right edge
const CWID = X1 - M;     // 968 content width

S.push(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">`);
rect(0, 0, 1024, 1024, PAPER);

// ---- masthead ------------------------------------------------------------
text(512, 26, 'THE WORLD IN ONE DAY', 12.5, INK, 'sans', 700, 'middle', 5);
text(512, 86, data.date, 62, INK, 'pf', 900, 'middle');
text(512, 112, data.dek, 17, ACCENT, 'serif', 400, 'middle', 0, 'italic');
line(M, 120, X1, 120, INK, 1.5);

// ---- stat strip (6 boxes) -------------------------------------------------
const statY = 126, statH = 34, gap = 6, bw = (CWID - 5 * gap) / 6;
data.stats.forEach((s, i) => {
  const x = M + i * (bw + gap);
  rect(x, statY, bw, statH, CARD, `stroke="${INK}" stroke-width="1"`);
  text(x + bw / 2, statY + 21, s.num, 22, ACCENT, 'sans', 700, 'middle');
  text(x + bw / 2, statY + 32, s.label, 8.5, INK, 'sans', 700, 'middle', 1);
});
// ---- region bar ------------------------------------------------------------
{
  const parts = [];
  data.regionBar.forEach((r, i) => {
    parts.push({ t: r.name + ' ', c: INK });
    parts.push({ t: String(r.count), c: ACCENT });
    if (i < data.regionBar.length - 1) parts.push({ t: '  ·  ', c: MUTED });
  });
  const total = parts.reduce((a, p) => a + textW(p.t, 11.5, 'sansBold'), 0);
  const inner = parts.map((p) => `<tspan fill="${p.c}" font-weight="700">${esc(p.t)}</tspan>`).join('');
  place(512 - total / 2, 174, total, 11.5, 'region bar');
  S.push(`<text x="512" y="174" font-family="Noto Sans" font-size="11.5" text-anchor="middle">${inner}</text>`);
}

// ---- heroes ----------------------------------------------------------------
const artB64 = fs.readFileSync(path.join(DIR, 'art-final-test.png')).toString('base64');
const heroCols = [M, 356, 684];
const heroW = 312, artY = 182, artH = 122;

function heroArt1(x, y, w, h) { // Japan flag + rising CPI bars + coin
  rect(x, y, w, h, '#DCE7D4', `stroke="${INK}" stroke-width="1"`);
  rect(x + 14, y + 22, 128, 74, '#FFFFFF', `stroke="${INK}" stroke-width="1"`);
  circ(x + 78, y + 59, 21, ACCENT);
  const bars = [18, 30, 44, 58, 74];
  bars.forEach((bh, i) => {
    rect(x + 166 + i * 24, y + h - 18 - bh, 16, bh, i % 2 ? GREEN : TEAL);
  });
  circ(x + w - 26, y + 30, 14, GOLD, `stroke="${INK}" stroke-width="1"`);
  circ(x + w - 26, y + 30, 9, 'none', `stroke="#8A6A20" stroke-width="1"`);
}
function heroArt3(x, y, w, h) { // LPR chart: rising bars + flat "held" line + coin
  rect(x, y, w, h, '#F0E2C8', `stroke="${INK}" stroke-width="1"`);
  for (let gy = y + 26; gy <= y + 96; gy += 23) line(x + 12, gy, x + w - 12, gy, '#D8C9A8', 1);
  const bars = [24, 34, 46, 58, 76];
  bars.forEach((bh, i) => {
    rect(x + 26 + i * 44, y + h - 16 - bh, 30, bh, i % 2 ? TERRA : TEAL);
  });
  S.push(`<line x1="${x + 16}" y1="${y + 26}" x2="${x + w - 16}" y2="${y + 26}" stroke="${ACCENT}" stroke-width="2.5" stroke-dasharray="7 5"/>`);
  poly(`${x + w - 34},${y + 18} ${x + w - 16},${y + 26} ${x + w - 34},${y + 34}`, ACCENT);
  circ(x + w - 24, y + h - 22, 13, GOLD, `stroke="${INK}" stroke-width="1"`);
}

data.heroes.forEach((hero, i) => {
  const x = heroCols[i];
  if (hero.illu === 'flags') heroArt1(x, artY, heroW, artH);
  else if (hero.illu === 'chart') heroArt3(x, artY, heroW, artH);
  else {
    rect(x, artY, heroW, artH, '#20242E', `stroke="${INK}" stroke-width="1"`);
    S.push(`<image href="data:image/png;base64,${artB64}" x="${x}" y="${artY}" width="${heroW}" height="${artH}" preserveAspectRatio="xMidYMid slice"/>`);
  }
  // kicker + status chip
  text(x, 324, hero.kicker, 10.5, ACCENT, 'sans', 700, 'start', 0.5);
  const chip = `${hero.status.label} · ${hero.status.source}`;
  const chipW = textW(chip, 9, 'sansBold') + 12;
  const chipX = x + heroW - chipW;
  rect(chipX, 312, chipW, 15, INK);
  text(chipX + 6, 323, chip, 9, '#FFFFFF', 'sans', 700);
  // headline (2 lines max) + dek
  const hl = wrap(hero.headline, heroW, 22, 'playfair', 0, 2);
  hl.forEach((ln, j) => text(x, 344 + j * 25, ln, 22, INK, 'pf', 900));
  const dk = wrap(hero.dek, heroW, 12, 'sans', 0, 2);
  dk.forEach((ln, j) => text(x, 396 + j * 14, ln, 12, MUTED, 'sans'));
});

// ---- grid title ------------------------------------------------------------
rect(M, 412, CWID, 23, ACCENT);
text(M + 12, 428, data.gridTitle, 12.5, '#FFFFFF', 'sans', 700, 'start', 1.5);
text(X1 - 12, 428, data.countLine, 11, '#FFFFFF', 'sans', 700, 'end', 0.5);

// ---- grid illustrations (flat scenes, drawn from the story, not symbols) ---
function scene(kind, x, y, s) {
  if (kind === 'cyclone') {
    rect(x, y, s, s, '#3E6B62');
    S.push(`<path d="M ${x + 23} ${y + 23} m -14 0 a 14 14 0 1 1 14 14 a 10 10 0 1 1 -10 -10 a 6 6 0 1 1 6 6" fill="none" stroke="#F2E7D0" stroke-width="3"/>`);
    circ(x + 23, y + 23, 3, '#F2E7D0');
    poly(`${x},${y + s} ${x + s},${y + s} ${x + s},${y + s - 8} ${x},${y + s - 8}`, '#5C7A4C');
  } else if (kind === 'summit') {
    rect(x, y, s, s, '#D9C9A8');
    rect(x + 8, y + 14, 30, 26, '#4A3F30');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) rect(x + 12 + c * 7, y + 18 + r * 7, 4, 4, '#C99A3C');
    line(x + 8, y + 40, x + 38, y + 40, '#4A3F30', 2);
    line(x + 42, y + 10, x + 42, y + 40, INK, 1.5);
    poly(`${x + 42},${y + 10} ${x + 42},${y + 20} ${x + 30},${y + 15}`, '#2E4A8A');
    circ(x + 36, y + 15, 1.2, GOLD);
  } else if (kind === 'globe') {
    rect(x, y, s, s, '#7A9A8E');
    circ(x + 23, y + 23, 16, '#EFE4CB');
    S.push(`<ellipse cx="${x + 23}" cy="${y + 23}" rx="16" ry="6.5" fill="none" stroke="${TEAL}" stroke-width="1.5"/>`);
    line(x + 23, y + 7, x + 23, y + 39, TEAL, 1.5);
    S.push(`<ellipse cx="${x + 23}" cy="${y + 23}" rx="7" ry="16" fill="none" stroke="${TEAL}" stroke-width="1.5"/>`);
    poly(`${x + 34},${y + 8} ${x + 42},${y + 4} ${x + 40},${y + 14}`, GREEN);
  } else if (kind === 'crowd') {
    rect(x, y, s, s, '#C98A5A');
    circ(x + 13, y + 20, 6, '#E8C39A');
    circ(x + 23, y + 16, 6, '#C9A06A');
    circ(x + 33, y + 20, 6, '#8A5A3A');
    rect(x + 7, y + 27, 12, 10, '#4A3F30');
    rect(x + 17, y + 23, 12, 10, '#2B2117');
    rect(x + 27, y + 27, 12, 10, '#5C4A33');
    rect(x + 30, y + 6, 12, 8, '#F2E7D0', `stroke="${INK}" stroke-width="1"`);
    line(x + 36, y + 14, x + 36, y + 27, INK, 1.5);
  } else if (kind === 'rocket') {
    rect(x, y, s, s, '#2E4A6B');
    circ(x + 8, y + 8, 1.5, '#FFFFFF');
    circ(x + 38, y + 12, 1.5, '#FFFFFF');
    circ(x + 36, y + 34, 1.2, '#FFFFFF');
    poly(`${x + 23},${y + 6} ${x + 19},${y + 16} ${x + 27},${y + 16}`, ACCENT);
    rect(x + 19, y + 16, 8, 16, '#F2E7D0');
    circ(x + 23, y + 22, 2.5, TEAL);
    poly(`${x + 19},${y + 32} ${x + 14},${y + 38} ${x + 19},${y + 36}`, ACCENT);
    poly(`${x + 27},${y + 32} ${x + 32},${y + 38} ${x + 27},${y + 36}`, ACCENT);
    poly(`${x + 23},${y + 38} ${x + 19},${y + 32} ${x + 27},${y + 32} ${x + 25},${y + 41} ${x + 21},${y + 41}`, GOLD);
  } else if (kind === 'coins') {
    rect(x, y, s, s, '#D8C690');
    S.push(`<ellipse cx="${x + 20}" cy="${y + 34}" rx="13" ry="4.5" fill="${GOLD}" stroke="${INK}" stroke-width="1"/>`);
    S.push(`<ellipse cx="${x + 20}" cy="${y + 28}" rx="13" ry="4.5" fill="${GOLD}" stroke="${INK}" stroke-width="1"/>`);
    S.push(`<ellipse cx="${x + 20}" cy="${y + 22}" rx="13" ry="4.5" fill="${GOLD}" stroke="${INK}" stroke-width="1"/>`);
    line(x + 30, y + 32, x + 42, y + 14, GREEN, 2.5);
    poly(`${x + 34},${y + 26} ${x + 42},${y + 18} ${x + 40},${y + 28} ${x + 36},${y + 24} ${x + 34},${y + 30}`, GREEN);
  } else if (kind === 'phone') {
    rect(x, y, s, s, '#5C7A4C');
    rect(x + 15, y + 6, 16, 32, '#2B2117', 'rx="3"');
    rect(x + 18, y + 10, 10, 20, TEAL, 'rx="1"');
    S.push(`<path d="M ${x + 34} ${y + 12} a 8 8 0 0 1 0 8" fill="none" stroke="#F2E7D0" stroke-width="2"/>`);
    S.push(`<path d="M ${x + 34} ${y + 8} a 13 13 0 0 1 0 16" fill="none" stroke="#F2E7D0" stroke-width="2"/>`);
    circ(x + 23, y + 34, 1.5, '#F2E7D0');
  } else if (kind === 'stage') {
    rect(x, y, s, s, '#3A2E4A');
    S.push(`<polygon points="${x + 6},${y + 8} ${x + 20},${y + 34} ${x + 14},${y + 34} ${x + 2},${y + 10}" fill="#F2E7D0" opacity="0.35"/>`);
    S.push(`<polygon points="${x + 40},${y + 8} ${x + 26},${y + 34} ${x + 32},${y + 34} ${x + 44},${y + 10}" fill="#F2E7D0" opacity="0.35"/>`);
    poly(`${x + 12},${y + 38} ${x + 34},${y + 38} ${x + 38},${y + 44} ${x + 8},${y + 44}`, '#8A6A20');
    poly(`${x + 23},${y + 12} ${x + 25},${y + 17} ${x + 30},${y + 17} ${x + 26},${y + 20} ${x + 27},${y + 25} ${x + 23},${y + 22} ${x + 19},${y + 25} ${x + 20},${y + 20} ${x + 16},${y + 17} ${x + 21},${y + 17}`, GOLD);
  } else if (kind === 'cricket') {
    rect(x, y, s, s, '#8A9A5B');
    S.push(`<rect x="${x + 12}" y="${y + 10}" width="6" height="24" rx="3" fill="#D8B98A" stroke="${INK}" stroke-width="1" transform="rotate(28 ${x + 15} ${y + 22})"/>`);
    circ(x + 32, y + 14, 5, ACCENT);
    line(x + 12, y + 34, x + 12, y + 42, '#F2E7D0', 2);
    line(x + 17, y + 34, x + 17, y + 42, '#F2E7D0', 2);
    line(x + 22, y + 34, x + 22, y + 42, '#F2E7D0', 2);
    line(x + 10, y + 34, x + 24, y + 34, '#F2E7D0', 2);
  } else if (kind === 'port') {
    rect(x, y, s, s, '#4F7A6F');
    poly(`${x + 4},${y + 30} ${x + 42},${y + 30} ${x + 38},${y + 40} ${x + 8},${y + 40}`, '#2B2117');
    rect(x + 8, y + 20, 10, 9, TERRA, `stroke="${INK}" stroke-width="0.75"`);
    rect(x + 19, y + 20, 10, 9, GOLD, `stroke="${INK}" stroke-width="0.75"`);
    rect(x + 30, y + 20, 10, 9, '#2E4A8A', `stroke="${INK}" stroke-width="0.75"`);
    rect(x + 13, y + 11, 10, 8, '#7A9A8E', `stroke="${INK}" stroke-width="0.75"`);
    line(x + 40, y + 6, x + 40, y + 30, INK, 1.5);
    line(x + 34, y + 6, x + 42, y + 6, INK, 1.5);
    circ(x + 40, y + 12, 2, GOLD);
  }
}
const sceneByN = {
  4: 'cyclone', 5: 'summit', 6: 'globe', 7: 'crowd', 8: 'rocket',
  9: 'coins', 10: 'phone', 11: 'stage', 12: 'cricket', 13: 'port',
};

// ---- grid (2 cols x 5 rows) ------------------------------------------------
const gridCols = [M, 512];
const gridRowY = 444, gridPitch = 45, thumb = 44;
data.grid.forEach((g, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = gridCols[col], y = gridRowY + row * gridPitch;
  scene(sceneByN[g.n], x, y, thumb);
  rect(x, y, thumb, thumb, 'none', `stroke="${INK}" stroke-width="1"`);
  // number badge on the thumb corner
  rect(x - 3, y - 3, 14, 14, ACCENT);
  text(x + 4, y + 8, String(g.n), 10, '#FFFFFF', 'sans', 700, 'middle');
  const hx = x + thumb + 12;
  const hl = wrap(g.headline, 420, 16, 'playfair', 0, 2);
  hl.forEach((ln, j) => text(hx, y + 18 + j * 19, ln, 16, INK, 'pf', 900));
  const ky = y + 18 + (hl.length - 1) * 19 + 15;
  const pillW = textW(g.kicker, 8.5, 'sansBold', 0.5) + 10;
  rect(hx, ky - 10, pillW, 13, CARD, `stroke="${MUTED}" stroke-width="0.75" rx="6.5"`);
  text(hx + 5, ky, g.kicker, 8.5, MUTED, 'sans', 700, 'start', 0.5);
});

// ---- map --------------------------------------------------------------------
const mapTitleY = 682;
text(M, mapTitleY, data.mapTitle, 12, ACCENT, 'sans', 700, 'start', 1.5);
text(X1, mapTitleY, data.mapCaption, 10, MUTED, 'sans', 400, 'end');
const mapX = M, mapY = 690, mapW = 340, mapH = 94;
rect(mapX, mapY, mapW, mapH, SEA, `stroke="${INK}" stroke-width="1"`);
// equirectangular projection, lon -168..192, lat 78..-58
const px = (lon) => mapX + ((lon + 168) / 360) * mapW;
const py = (lat) => mapY + ((78 - lat) / 136) * mapH;
const land = (pts) => S.push(`<polygon points="${pts.map(([lo, la]) => `${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join(' ')}" fill="${SAGE}"/>`);
land([[-166, 68], [-150, 70], [-135, 69], [-125, 71], [-110, 73], [-95, 80], [-85, 76], [-80, 73], [-70, 62], [-60, 55], [-55, 47], [-60, 45], [-70, 42], [-75, 38], [-76, 34], [-80, 26], [-81, 25], [-87, 21], [-90, 15], [-95, 16], [-100, 18], [-105, 20], [-110, 24], [-114, 29], [-120, 34], [-124, 40], [-124, 48], [-130, 55], [-140, 60], [-152, 58], [-158, 56], [-162, 60]]);
land([[-78, 8], [-72, 11], [-64, 10], [-58, 6], [-52, 4], [-50, 0], [-44, -3], [-38, -5], [-35, -8], [-38, -15], [-40, -22], [-48, -27], [-52, -32], [-58, -38], [-64, -41], [-66, -47], [-68, -52], [-70, -55], [-73, -50], [-73, -42], [-72, -30], [-71, -20], [-75, -15], [-79, -6], [-81, 0]]);
land([[-17, 15], [-16, 20], [-11, 27], [-6, 33], [0, 36], [10, 37], [11, 34], [20, 32], [30, 31], [32, 31], [34, 28], [36, 22], [39, 18], [43, 12], [48, 11], [51, 11], [48, 4], [42, -2], [40, -8], [36, -15], [35, -22], [32, -28], [28, -33], [20, -35], [16, -32], [14, -22], [12, -17], [13, -10], [9, -1], [9, 4], [4, 6], [-8, 5], [-13, 8], [-17, 12]]);
land([[-10, 37], [-5, 43], [-2, 48], [2, 51], [7, 54], [10, 57], [18, 56], [21, 55], [25, 58], [30, 60], [35, 65], [45, 68], [55, 68], [65, 70], [75, 72], [85, 74], [95, 76], [105, 77], [115, 73], [125, 72], [135, 71], [145, 72], [155, 70], [165, 66], [178, 65], [170, 62], [162, 60], [158, 55], [155, 52], [150, 48], [145, 45], [142, 40], [140, 35], [137, 33], [135, 34], [132, 33], [130, 32], [127, 35], [126, 38], [124, 40], [122, 38], [120, 35], [120, 30], [118, 25], [115, 22], [112, 20], [109, 18], [108, 15], [105, 10], [103, 8], [101, 6], [99, 8], [97, 12], [95, 15], [93, 18], [91, 22], [89, 22], [87, 21], [85, 19], [82, 16], [80, 13], [78, 8], [76, 10], [74, 15], [72, 20], [70, 23], [68, 24], [66, 25], [63, 25], [60, 25], [57, 26], [55, 27], [52, 28], [50, 29], [48, 30], [45, 29], [43, 28], [40, 30], [38, 32], [36, 36], [33, 36], [30, 36], [27, 37], [23, 36], [20, 38], [18, 40], [15, 42], [12, 44], [8, 44], [5, 43], [2, 41], [0, 39], [-3, 37], [-6, 36], [-9, 37]]);
land([[114, -22], [113, -26], [115, -32], [118, -35], [124, -33], [129, -32], [132, -32], [135, -35], [138, -35], [140, -38], [142, -38], [146, -39], [150, -37], [153, -32], [153, -27], [150, -22], [146, -19], [142, -15], [142, -11], [137, -12], [135, -12], [132, -11], [130, -13], [126, -14], [122, -17], [118, -20]]);
land([[-45, 60], [-40, 64], [-32, 68], [-22, 70], [-20, 74], [-25, 78], [-35, 80], [-45, 79], [-55, 76], [-58, 72], [-53, 68], [-48, 64]]);
land([[130, 31], [132, 33], [135, 34], [138, 36], [140, 38], [141, 40], [142, 42], [140, 44], [138, 42], [136, 38], [133, 35]]);
land([[-5, 50], [-3, 53], [-5, 56], [-2, 58], [0, 54], [-1, 51]]);
for (const [lo, la] of [[95, -5], [105, -7], [113, -7], [120, -9], [130, -4]]) {
  S.push(`<ellipse cx="${px(lo).toFixed(1)}" cy="${py(la).toFixed(1)}" rx="5" ry="2.2" fill="${SAGE}"/>`);
}
S.push(`<polygon points="${px(167).toFixed(1)},${py(-45).toFixed(1)} ${px(170).toFixed(1)},${py(-41).toFixed(1)} ${px(174).toFixed(1)},${py(-38).toFixed(1)} ${px(176).toFixed(1)},${py(-40).toFixed(1)} ${px(172).toFixed(1)},${py(-43).toFixed(1)}" fill="${SAGE}"/>`);
// grey dots (briefs) then numbered pins (main stories)
// Brussels (5) and London (7) sit ~4px apart at this scale, so their pins
// are nudged a few px apart — standard cartographic displacement.
const pinNudge = { 5: [5, 4], 7: [-6, -5] };
for (const d of data.greyDots) circ(px(d.lon), py(d.lat), 2.5, GREY, 'class="dot"');
for (const p of data.pins) {
  const [nx, ny] = pinNudge[p.n] || [0, 0];
  const cx = px(p.lon) + nx, cy = py(p.lat) + ny;
  circ(cx, cy, 7, ACCENT, `class="pin" stroke="#FFFFFF" stroke-width="1.2"`);
  text(cx, cy + 3, String(p.n), 8, '#FFFFFF', 'sans', 700, 'middle');
}
// map legend (2 columns, right of the map)
const legend = [
  ['1 Japan CPI — Tokyo', '2 Florida floods — Miami', '3 China LPR — Beijing', '4 Akvan landfall — India', '5 UK–EU summit — Brussels'],
  ['6 COP31 — Antalya', '7 Youth strike — London', '8 USSF-317 — Vandenberg', '14 Pakistan petrol rise'],
];
legend.forEach((col, ci) => {
  col.forEach((label, ri) => {
    const lx = ci === 0 ? 384 : 690, ly = 704 + ri * 20;
    const num = label.split(' ')[0];
    rect(lx, ly - 11, 14, 14, ACCENT);
    text(lx + 7, ly, num, 9.5, '#FFFFFF', 'sans', 700, 'middle');
    text(lx + 20, ly, label.replace(/^\S+ /, ''), 11.5, INK, 'sans');
  });
});

// ---- timeline ---------------------------------------------------------------
text(M, 800, 'THE DAY IN UTC', 12, ACCENT, 'sans', 700, 'start', 1.5);
{
  const slotW = CWID / 6;
  data.timeline.forEach((t, i) => {
    const sx = M + i * slotW;
    const tw = textW(t.time, 11, 'sansBold');
    place(sx, 818, tw + 6 + textW(t.label, 11, 'sans'), 11, `tl ${t.time} ${t.label}`);
    S.push(`<text x="${sx}" y="818" font-family="Noto Sans" font-size="11" font-weight="700" fill="${ACCENT}">${esc(t.time)}</text>`);
    S.push(`<text x="${sx + tw + 6}" y="818" font-family="Noto Sans" font-size="11" fill="${INK}">${esc(t.label)}</text>`);
    S.push(`<g class="tl" data-time="${esc(t.time)}" data-label="${esc(t.label)}"/>`);
  });
}
line(M, 826, X1, 826, INK, 0.75);

// ---- brief strip (4 cols x 5 rows, column-major) ----------------------------
text(M, 842, data.briefTitle, 12, ACCENT, 'sans', 700, 'start', 1.5);
{
  const colX = [M, 270, 512, 754];
  const rows = [858, 876, 894, 912, 930];
  data.brief.forEach((b, i) => {
    const col = Math.floor(i / 5), row = i % 5;
    const x = colX[col], y = rows[row];
    if (b.headline.length > 31) throw new Error(`brief #${b.n} headline >31 chars: "${b.headline}"`);
    text(x, y, String(b.n), 11, ACCENT, 'sans', 700);
    text(x + 20, y, b.headline, 11.5, INK, 'sans');
  });
}

// ---- DATE CHECK --------------------------------------------------------------
rect(M, 940, CWID, 30, ACCENT);
text(M + 12, 952, data.dateCheck, 11.5, '#FFFFFF', 'sans', 700);
text(M + 12, 966, `Not yet: ${data.notYet}`, 11.5, '#FFFFFF', 'sans', 700);

// ---- footer ------------------------------------------------------------------
text(M, 982, data.footer, 9.5, MUTED, 'sans');
text(M, 995, data.footer2, 9.5, MUTED, 'sans');
S.push('</svg>');

const svg = S.join('\n');

// ------------------------------------------------------------- render + PNG
const resvg = new Resvg(svg, {
  font: {
    loadSystemFonts: false,
    fontFiles: [
      '/home/hatch/.fonts/PlayfairDisplay-Black.ttf',
      '/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf',
      '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf',
      '/usr/share/fonts/truetype/noto/NotoSans-Italic.ttf',
      '/usr/share/fonts/truetype/noto/NotoSerif-Regular.ttf',
      '/usr/share/fonts/truetype/noto/NotoSerif-Italic.ttf',
      '/usr/share/fonts/truetype/noto/NotoSerif-Bold.ttf',
    ],
    defaultFontFamily: 'Noto Sans',
  },
});
const { width, height, pixels } = resvg.render();
if (width !== 1024 || height !== 1024) throw new Error(`render size ${width}x${height}`);

// RGB PNG, filter 0 per scanline, zlib level 9 — deterministic, lossless.
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
const pngChunk = (type, dataBuf) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(dataBuf.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), dataBuf]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
const rgb = Buffer.alloc(width * height * 3);
for (let i = 0; i < width * height; i++) {
  rgb[i * 3] = pixels[i * 4];
  rgb[i * 3 + 1] = pixels[i * 4 + 1];
  rgb[i * 3 + 2] = pixels[i * 4 + 2];
}
const raw = Buffer.alloc(height * (1 + width * 3));
for (let y = 0; y < height; y++) {
  raw[y * (1 + width * 3)] = 0;
  rgb.copy(raw, y * (1 + width * 3) + 1, y * width * 3, (y + 1) * width * 3);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(1024, 0); ihdr.writeUInt32BE(1024, 4);
ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  pngChunk('IHDR', ihdr),
  pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  pngChunk('IEND', Buffer.alloc(0)),
]);
fs.writeFileSync(pngOut, png);
if (svgOut) fs.writeFileSync(svgOut, svg);
console.log(`${pngOut}: ${png.length} bytes, sha256 ${crypto.createHash('sha256').update(png).digest('hex')}`);
