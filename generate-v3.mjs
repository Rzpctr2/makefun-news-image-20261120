// generate-v3.mjs — news-image-20261120 v3, TOP-25 ATTEMPT (Friday 20 November 2026).
// Ditulis penuh di sesi ini. Gibran 20 Nov 14:10-14:11 WIB: "ok kita top 25 aja
// deh" + "fokus kesitu dulu baru submit" — target direvisi dari top-10 ke
// top-25, dan v1 submit DIJEDA (v1 tidak disentuh; v3 dibangun dulu, submit
// belakangan). Target judge: garis top-25 19 Nov ≈ 0,986+ (top-50 0,988555,
// top-10 ≈ 0,990+); v26 19 Nov 0,983404 di #359-450. Puncak tetap lotre,
// tapi v3 harus upgrade NYATA dari v2 di sumbu yang bisa dikontrol.
//
// Perubahan v3 vs v2 (autopsi 18 Nov §6 + riset B 20 Nov 14:14 WIB):
//   V1. BREADTH 40+: 3 hero + 10 grid + 28-32 brief = 41-45 cerita (v2: 33).
//       TIDAK ADA cerita v2 yang dipotong (pelajaran v13) — Florida hanya
//       turun hero->brief. Ruang dicari dengan: tail pitch 13 (dari 14),
//       grid pitch 57 (dari 58), DATE CHECK 3 baris -> 2 baris, peta
//       300x110 -> 460x90 (lebih lebar, sedikit lebih pendek), footer
//       tetap 2 baris. Layout paruh bawah MENGALIR dari cursor (bukan
//       konstanta keras) agar jumlah baris tail mengikuti data.
//   V2. HERO #2 DIGANTI: Florida/Kyle -> Taiwan Taiex crash. Florida itu
//       peristiwa multi-hari (rekor St Johns 17,8 ft terjadi Kamis 19 Nov;
//       Kyle baru 60% peluang 7 hari, belum terbentuk). Taiwan 20 Nov itu
//       guncangan diskret bertanggal: Taiex -2.393,60 pts (-6,22%) ke
//       36.033,29; minggu terburuk sejak 1991 (>17%); ~$1,12T lenyap sejak
//       rekor 6 Okt. Hero #1 Japan CPI + #3 China LPR dipertahankan.
//       Akvan tetap grid #4 (besar tapi tanpa korban — bukan hero).
//       Ilustrasi hero #2 baru: Taipei 101 + grafik jatuh (digambar, bukan
//       art vaporwave — art v15 tidak lagi dipakai di v3).
//   V3. STAT STRIP = 6 angka TERBESAR hari itu (riset B): $1.12T Taiwan
//       lenyap, -6.22% Taiex, 370K Akvan, 2.2% Japan CPI, 92.000 COP31,
//       -7% emas seminggu. (v2: $81.3BN Anthropic, £17BN UK-EU, 300+,
//       60% Kyle — angka lapis dua.)
//   V4. DATE CHECK 4-8 item high-salience SAJA + alasan bertanggal
//       (v2: 12 item). Disclosure chip AI 879.868 (19/11) masuk sini,
//       BUKAN sebagai cerita 20 Nov. Tanpa trivia.
//   V5. PETA dotted BESAR: 460px lebar (v2: 300px) + pin bernomor 1-8,14
//       + dot abu brief. Legenda 2 kolom di kanan peta.
//   V6. Tail bernomor URUT tanpa bolong (14..N) — verifier memeriksa.
//   V7. Byte cap situs = 1 MiB (RULES.txt 20 Nov); target PNG < 700 KB.
//       (Angka 307.200 B selama ini cap konservatif sendiri, bukan situs.)
//   V8. Timeline: slot MAMA 09:00 diganti Taiex tutup 05:30 (peristiwa
//       pasar terbesar hari itu); 6 slot tetap.
// Bottom target: GEN 1018 (rendered 1002, margin atas 32 / bawah 22)
// untuk tail 8 baris; tail 7 baris berakhir lebih tinggi (margin lebih besar).
// Usage: node generate-v3.mjs <news-v3.json> <out.png> [out.svg]
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { Resvg } from "@resvg/resvg-js";

const PHI = 1.61803; // golden ratio, 5 digit (Gibran 16:16 WIB)
const PI = 3.14159; // pi, 5 digit
const GOLDEN_ANGLE = 360 / (PHI * PHI); // 137.50844 deg
let OY = -16; // geser vertikal global; semua helper y menambah OY
const W = 1024, H = 1024;
const PAPER = "#F2E8D5", PANEL = "#EADFC6", INK = "#2E2118", MUTED = "#6B5844";
const PIN = "#BC2F0E", DEK = "#3D2C1E"; // aksen vermilion
const GOLD = "#F2B705", SEA = "#E9F1EA";
const LAND = "#5C8A74", LAND2 = "#4C7A64", LAND3 = "#63917A"; // daratan vs laut >=3:1
const FONT = "Noto Sans, sans-serif";
const DISPLAY = "Playfair Display";
const ACCENT = PIN; // SATU warna aksen sistem
const BAND = "#EDE2CC"; // band selang-seling tail
const STATUS_FILL = { REPORTED: "#1F6B3A", FORECAST: "#1F4E79", CLAIM: ACCENT };

// ---------- audit bbox (gate overlap: teks-vs-teks) ----------
const boxes = []; // {x,y,w,h,kind,label} — y = atas bbox (rendered)
function box(x, y, w, h, kind, label) { boxes.push({ x, y: y + OY, w, h, kind, label }); return ""; }
// lebar teks estimasi (konservatif): bold 0.56em, regular 0.50em, display 0.60em
function textW(str, size, weight = 400, family = FONT) {
  const f = family === DISPLAY ? 0.60 : (weight >= 700 ? 0.56 : 0.50);
  return Math.round(String(str).length * size * f);
}
function textBox(x, y, str, { size = 16, weight = 400, family = FONT, anchor = "start" } = {}) {
  const w = textW(str, size, weight, family);
  const bx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  const hasDesc = /[gjpqy]/.test(str);
  box(bx, y - size * 0.72, w, size * (hasDesc ? 0.97 : 0.74), "text", str);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function text(x, y, str, { size = 16, weight = 400, fill = INK, anchor = "start", spacing = 0, style = "", family = FONT } = {}) {
  textBox(x, y, str, { size, weight, family, anchor });
  const ls = spacing ? ` letter-spacing="${spacing}"` : "";
  const fs = style ? ` font-style="${style}"` : "";
  return `<text x="${x}" y="${y + OY}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${ls}${fs}>${esc(str)}</text>`;
}

function wrap(str, maxWidth, size, weight = 400) {
  const cw = size * (weight >= 700 ? 0.56 : 0.50);
  const maxChars = Math.max(8, Math.floor(maxWidth / cw));
  const words = String(str).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? cur + " " + w : w;
    if (next.length <= maxChars) cur = next;
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function poly(points, fill, opacity = 1, stroke = null) {
  const pts = points.map((p) => [p[0], p[1] + OY].join(",")).join(" ");
  const st = stroke ? ` stroke="${stroke}" stroke-width="1.5"` : "";
  return `<polygon points="${pts}" fill="${fill}"${opacity !== 1 ? ` opacity="${opacity}"` : ""}${st}/>`;
}
function rect(x, y, w, h, fill, opacity = 1) {
  return `<rect x="${x}" y="${y + OY}" width="${w}" height="${h}" fill="${fill}"${opacity !== 1 ? ` opacity="${opacity}"` : ""}/>`;
}
function line(x1, y1, x2, y2, stroke, width = 2, opacity = 1) {
  return `<line x1="${x1}" y1="${y1 + OY}" x2="${x2}" y2="${y2 + OY}" stroke="${stroke}" stroke-width="${width}"${opacity !== 1 ? ` opacity="${opacity}"` : ""}/>`;
}
function circle(cx, cy, r, fill, stroke = null, sw = 1) {
  const st = stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : "";
  return `<circle cx="${cx}" cy="${cy + OY}" r="${r}" fill="${fill}"${st}/>`;
}
function starPts(cx, cy, rO, rI, n = 5, rot = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < 2 * n; i++) {
    const r = i % 2 === 0 ? rO : rI, a = rot + (i * Math.PI) / n;
    pts.push([Math.round((cx + r * Math.cos(a)) * 10) / 10, Math.round((cy + r * Math.sin(a)) * 10) / 10]);
  }
  return pts;
}
function spiralPts(cx, cy, turns, rMax) {
  const pts = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * 2 * Math.PI;
    const r = 1 + (t / (turns * 2 * Math.PI)) * (rMax - 1);
    pts.push([Math.round((cx + r * Math.cos(t)) * 10) / 10, Math.round((cy + r * Math.sin(t)) * 10) / 10]);
  }
  return pts;
}
function polyline(pts, stroke, width = 2, opacity = 1) {
  const p = pts.map((q) => [q[0], q[1] + OY].join(",")).join(" ");
  return `<polyline points="${p}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${opacity !== 1 ? ` opacity="${opacity}"` : ""}/>`;
}

// ---------- masthead ----------
// Tanggal RAKSASA Didone sebagai masthead + dek merah miring; kicker kecil di atas.
function masthead(d) {
  let s = "";
  s += text(512, 58, "THE WORLD IN ONE DAY", { size: 12, weight: 800, fill: INK, anchor: "middle", spacing: 4 });
  s += text(512, 112, d.date, { size: 54, weight: 900, fill: INK, anchor: "middle", family: DISPLAY });
  s += text(512, 140, d.dek, { size: 16, weight: 400, fill: ACCENT, anchor: "middle", style: "italic" });
  s += rect(48, 150, 928, 2, INK);
  return s;
}

// ---------- peta dunia (data geografi: poligon benua + facet) ----------
const CONTINENTS = [
  { name: "North America", fill: LAND, pts: [[-168,66],[-150,70],[-135,69],[-125,71],[-110,73],[-95,80],[-85,76],[-75,73],[-65,62],[-55,60],[-60,47],[-65,44],[-70,42],[-75,35],[-80,26],[-81,25],[-87,21],[-90,21],[-95,18],[-97,16],[-94,17],[-90,14],[-85,11],[-80,8],[-79,9],[-83,9],[-88,13],[-92,15],[-97,16],[-102,18],[-105,20],[-110,23],[-114,28],[-118,33],[-122,37],[-124,42],[-124,48],[-130,54],[-140,60],[-150,61],[-158,58],[-162,55],[-166,60],[-168,66]] },
  { name: "Greenland", fill: LAND3, pts: [[-58,64],[-52,60],[-43,60],[-32,68],[-25,70],[-30,76],[-45,78],[-58,76],[-62,70]] },
  { name: "South America", fill: LAND2, pts: [[-80,10],[-77,7],[-75,5],[-70,0],[-65,-3],[-60,-5],[-55,-5],[-50,-2],[-44,-3],[-38,-5],[-35,-8],[-37,-13],[-40,-20],[-42,-23],[-48,-27],[-52,-32],[-57,-38],[-62,-41],[-65,-45],[-68,-50],[-70,-54],[-72,-50],[-73,-44],[-73,-37],[-72,-30],[-71,-22],[-71,-18],[-75,-15],[-78,-10],[-80,-5],[-81,0],[-80,5]] },
  { name: "Africa", fill: LAND, pts: [[-17,15],[-16,20],[-12,27],[-9,31],[-5,35],[0,36],[5,37],[10,37],[15,32],[20,32],[25,31],[30,31],[32,30],[35,28],[38,22],[40,18],[43,12],[48,11],[51,10],[48,5],[44,0],[40,-5],[38,-10],[35,-15],[33,-20],[31,-25],[28,-30],[25,-34],[20,-35],[17,-32],[15,-27],[13,-22],[12,-17],[11,-12],[9,-5],[9,0],[9,4],[6,4],[0,6],[-7,5],[-12,7],[-15,10],[-17,15]] },
  { name: "Asia", fill: LAND2, pts: [[30,70],[35,68],[40,67],[45,65],[50,68],[55,69],[60,70],[65,72],[70,73],[75,74],[80,75],[90,76],[100,77],[110,77],[120,76],[130,73],[140,72],[150,70],[160,69],[170,67],[178,65],[175,62],[170,60],[162,58],[158,52],[155,50],[150,45],[145,42],[140,39],[135,35],[130,33],[127,35],[126,38],[124,40],[122,38],[120,34],[118,30],[115,25],[110,20],[108,15],[105,10],[103,8],[100,7],[98,10],[95,15],[92,20],[90,22],[88,22],[86,20],[83,18],[80,13],[77,8],[75,12],[73,18],[70,22],[67,25],[64,25],[61,25],[58,26],[55,27],[52,28],[50,29],[48,30],[46,29],[44,29],[42,28],[40,30],[38,32],[36,36],[34,36],[32,38],[30,40],[30,45],[30,50],[30,55],[30,60],[30,65],[30,70]] },
  { name: "Europe", fill: LAND3, pts: [[-10,36],[-9,38],[-9,43],[-5,44],[-2,46],[-1,46],[-4,48],[-2,49],[0,50],[2,51],[4,53],[7,54],[8,57],[10,59],[12,58],[15,56],[18,56],[21,55],[21,58],[24,59],[26,60],[28,62],[30,65],[30,70],[35,68],[40,67],[44,64],[45,60],[42,58],[40,55],[38,52],[35,50],[33,48],[30,46],[28,44],[28,42],[26,41],[23,40],[22,38],[21,40],[19,42],[16,44],[14,45],[12,44],[10,44],[8,44],[6,43],[3,43],[0,40],[-2,37],[-6,36],[-9,37]] },
  { name: "Australia", fill: LAND, pts: [[113,-22],[113,-26],[114,-30],[115,-33],[118,-35],[122,-34],[126,-32],[129,-32],[132,-32],[135,-35],[137,-35],[140,-38],[143,-39],[146,-39],[149,-37],[150,-34],[152,-30],[153,-27],[151,-24],[148,-20],[146,-19],[143,-15],[142,-11],[140,-17],[138,-17],[136,-15],[135,-12],[132,-11],[129,-14],[126,-14],[123,-17],[120,-19],[117,-20],[114,-21]] },
  { name: "SE Asia islands", fill: LAND2, pts: [[95,5],[97,8],[99,10],[101,8],[103,5],[104,2],[102,0],[100,-2],[98,-4]] },
  { name: "Java", fill: LAND2, pts: [[105,-5],[108,-6],[111,-7],[114,-8],[116,-9],[114,-10],[110,-8],[107,-6]] },
  { name: "New Guinea", fill: LAND, pts: [[131,-1],[134,-2],[137,-3],[140,-3],[142,-4],[145,-5],[147,-6],[150,-8],[150,-10],[147,-9],[144,-8],[141,-8],[138,-7],[135,-5],[132,-3]] },
  { name: "Japan", fill: LAND3, pts: [[130,31],[131,33],[133,34],[135,34],[137,35],[139,35],[140,37],[141,39],[141,41],[142,43],[144,44],[145,44],[144,42],[142,40],[140,38],[138,36],[136,35],[134,34],[132,33]] },
  { name: "UK", fill: LAND3, pts: [[-5,50],[-3,53],[-5,55],[-4,57],[-2,58],[0,57],[1,54],[0,52],[-3,51]] },
  { name: "New Zealand", fill: LAND2, pts: [[167,-45],[168,-44],[170,-43],[172,-41],[174,-39],[176,-38],[178,-38],[176,-40],[174,-42],[172,-43],[170,-45],[168,-46]] },
  { name: "Madagascar", fill: LAND2, pts: [[44,-16],[47,-15],[50,-16],[50,-20],[48,-24],[45,-25],[43,-22],[43,-18]] },
];
const FACETS = [
  { fill: "#FFFFFF", op: 0.16, pts: [[-140,68],[-110,72],[-125,58]] },
  { fill: "#2E2118", op: 0.10, pts: [[-100,45],[-80,30],[-95,20]] },
  { fill: "#FFFFFF", op: 0.14, pts: [[-60,-5],[-45,-15],[-55,-30]] },
  { fill: "#FFFFFF", op: 0.15, pts: [[10,30],[25,20],[15,5]] },
  { fill: "#2E2118", op: 0.08, pts: [[25,-10],[35,-25],[20,-30]] },
  { fill: "#FFFFFF", op: 0.16, pts: [[70,70],[95,72],[85,55]] },
  { fill: "#2E2118", op: 0.08, pts: [[120,50],[140,45],[130,30]] },
  { fill: "#FFFFFF", op: 0.14, pts: [[125,-20],[140,-30],[135,-38]] },
];

// Proyeksi equirectangular: lon -180..180 -> x, lat 80..-60 -> y. Mengembalikan
// koordinat RENDERED (OY sudah ditambah) — pemanggil JANGAN tambah OY lagi.
function project(lon, lat, box) {
  const x = box.x + ((lon + 180) / 360) * box.w;
  const y = box.y + ((80 - lat) / 140) * box.h + OY;
  return [Math.round(x), Math.round(y)];
}

// Benua per cerita (untuk hitungan region bar + log). "SPACE" = null
// (di luar benua). Urutan kunci penting: "CANADA" sebelum "CHINA",
// "JAPAN" sebelum "GERMAN", "INDIA" sebelum "SPORT".
const REGION_TO_CONT = {
  "GAMING": null, "SPACE": null,
  "CANADA": "NA", "U.S.": "NA", "ALASKA": "NA", "FLORIDA": "NA",
  "CHINA": "AS", "INDIA": "AS", "JAPAN": "AS", "KOREA": "AS", "GAZA": "AS", "SAUDI ARABIA": "AS",
  "THE HAGUE": "EU", "BLACK SEA": "EU", "EU": "EU", "FRANCE": "EU", "ITALY": "EU", "SPORT": "EU",
  "MEXICO": "NA", "LATIN AMERICA": "SA",
  "AUSTRALIA": "OC", "HORN OF AFRICA": "AF", "LIBYA": "AF",
  "PAKISTAN": "AS", "INDONESIA": "AS", "OMAN": "AS", "TURKEY": "AS",
  "EGYPT": "AF", "AFRICA": "AF", "NEW ZEALAND": "OC", "ARGENTINA": "SA",
  "MALAWI": "AF", "TAIWAN": "AS",
};
function continentOf(it) {
  const hay = ((it.kicker || "") + " " + it.headline).toUpperCase();
  for (const [key, cont] of Object.entries(REGION_TO_CONT)) {
    if (hay.includes(key)) return cont;
  }
  return undefined;
}

// ---------- peta band ----------
// Kotak (x, y, w, h) GEN; pin = lingkaran merah r=8 + angka putih 10px;
// dot brief = abu r=3. Nudge tabrakan berulang (maks 4x, +12px vertikal):
// dot kecil r=3 di posisi benar + leader line + pin di posisi nudge.
function worldMapBand(d, x, y, w, h) {
  let s = "";
  s += rect(x, y, w, h, SEA);
  for (const lat of [60, 30, 0, -30]) {
    const yy = y + ((80 - lat) / 140) * h;
    s += line(x, yy, x + w, yy, "#FFFFFF", 1, 0.35);
  }
  const box = { x, y, w, h };
  for (const c of CONTINENTS) s += `<polygon points="${c.pts.map(([lo, la]) => project(lo, la, box)).map((p) => p.join(",")).join(" ")}" fill="${c.fill}" stroke="${INK}" stroke-width="1" stroke-opacity="0.35"/>`;
  for (const f of FACETS) s += `<polygon points="${f.pts.map(([lo, la]) => project(lo, la, box)).map((p) => p.join(",")).join(" ")}" fill="${f.fill}"${f.op !== 1 ? ` opacity="${f.op}"` : ""}/>`;
  const pinR = 8, pinGap = 18, pinNudge = 12;
  const placed = [];
  const placePin = (lon, lat, isBrief) => {
    let [px, py] = project(lon, lat, box);
    let nudged = false;
    for (let k = 0; k < 4; k++) {
      let conflict = false;
      for (const q of placed) {
        if (Math.abs(px - q[0]) < pinGap && Math.abs(py - q[1]) < pinGap) { conflict = true; break; }
      }
      if (!conflict) break;
      py += pinNudge; nudged = true;
    }
    if (nudged) {
      const [ox, oy] = project(lon, lat, box);
      s += `<circle cx="${ox}" cy="${oy}" r="3" fill="${isBrief ? "#8A7F6A" : PIN}"/>`;
      s += `<line x1="${ox}" y1="${oy}" x2="${px}" y2="${py - (pinR - 1)}" stroke="${isBrief ? "#8A7F6A" : PIN}" stroke-width="1.2" opacity="0.9"/>`;
    }
    const top = y + OY + pinR + 2, bot = y + h + OY - pinR - 2;
    px = Math.max(x + pinR + 2, Math.min(x + w - pinR - 2, px));
    py = Math.max(top, Math.min(bot, py));
    placed.push([px, py]);
    return [px, py];
  };
  for (const p of d.pins) {
    const [px, py] = placePin(p.lon, p.lat, false);
    s += `<circle cx="${px}" cy="${py}" r="${pinR}" fill="${PIN}" stroke="${INK}" stroke-width="1.5"/>`;
    s += text(px, py + 3.5, String(p.n), { size: 10, weight: 800, fill: "#FFFFFF", anchor: "middle" });
  }
  for (const g of d.greyDots) {
    const [px, py] = placePin(g.lon, g.lat, true);
    s += `<circle cx="${px}" cy="${py}" r="3" fill="#8A7F6A" stroke="${INK}" stroke-width="0.75"/>`;
  }
  s += `<rect x="${x}" y="${y + OY}" width="${w}" height="${h}" fill="none" stroke="${MUTED}" stroke-width="1"/>`;
  return s;
}

// ---------- ilustrasi grid: ADEGAN 34x34 ----------
// Tiap kartu = adegan utuh yang mengisi seluruh kotak: band langit (atas) +
// band tanah/laut (bawah) + horizon + 2-3 elemen. Gaya Flat 2.0 (2-3 tone,
// tanpa outline wajah). Sudut kiri atas 12x12 dibiarkan kosong (badge nomor).
// Semua fungsi mengambil (x, y) = sudut kiri atas kotak, koordinat GEN.
const ILLU_BG = "#EDE2CC";
const ILLU_TEAL = "#5C8A74", ILLU_BLUE = "#A8C4D4", ILLU_SAGE = "#A8B89A",
  ILLU_NAVY = "#2E3A4A", ILLU_TAN = "#D9B98A", ILLU_GOLD_BG = "#F2E3C0",
  ILLU_CREAM = "#F2E8D5", ILLU_WHITE = "#FFFFFF", ILLU_OLIVE = "#7C9A4E",
  ILLU_DBLUE = "#7A9BB5", ILLU_BROWN = "#8A5A33", ILLU_GOLD = "#E3B25D",
  ILLU_ORANGE = "#D96C2E";
// #4 Siklon Akvan — langit badai abu + laut teal + spiral putih + garis pantai + hujan.
function illu4(x, y) {
  let s = rect(x, y, 34, 14, "#8A97A3");
  s += rect(x, y + 14, 34, 20, ILLU_TEAL);
  s += poly([[x, y + 20], [x + 10, y + 14], [x + 16, y + 20], [x + 24, y + 15], [x + 34, y + 21], [x + 34, y + 34], [x, y + 34]], "#3E5C4C");
  s += polyline(spiralPts(x + 20, y + 22, 1.75, 10), ILLU_WHITE, 2.5);
  s += circle(x + 20, y + 22, 1.6, ILLU_WHITE);
  s += line(x + 5, y + 3, x + 3, y + 9, ILLU_WHITE, 1.5, 0.8);
  s += line(x + 11, y + 2, x + 9, y + 8, ILLU_WHITE, 1.5, 0.8);
  s += line(x + 29, y + 3, x + 27, y + 9, ILLU_WHITE, 1.5, 0.8);
  return s;
}
// #8 Pelabuhan LA — langit pucat + dermaga + derek kontainer + kontainer + papan piket.
function illu8(x, y) {
  let s = rect(x, y, 34, 20, ILLU_BLUE);
  s += rect(x, y + 20, 34, 14, ILLU_TAN);
  s += rect(x + 3, y + 4, 3, 18, INK);
  s += rect(x + 3, y + 4, 16, 3, INK);
  s += line(x + 19, y + 7, x + 19, y + 12, INK, 1.5);
  s += rect(x + 15, y + 12, 8, 5, ACCENT);
  s += rect(x + 6, y + 24, 10, 6, "#2E5A8A");
  s += rect(x + 18, y + 24, 10, 6, ILLU_TEAL);
  s += poly([[x + 26, y + 18], [x + 32, y + 18], [x + 29, y + 13]], ILLU_CREAM);
  s += line(x + 29, y + 18, x + 29, y + 24, INK, 1.5);
  return s;
}
// #9 Anthropic — langit emas + skyline gelap + garis naik + koin emas.
function illu9(x, y) {
  let s = rect(x, y, 34, 22, ILLU_GOLD_BG);
  s += rect(x, y + 22, 34, 12, ILLU_NAVY);
  s += rect(x + 3, y + 14, 5, 8, ILLU_NAVY);
  s += rect(x + 10, y + 10, 5, 12, ILLU_NAVY);
  s += rect(x + 26, y + 16, 5, 6, ILLU_NAVY);
  s += polyline([[x + 4, y + 20], [x + 12, y + 15], [x + 20, y + 10], [x + 30, y + 4]], ILLU_TEAL, 2.5);
  s += poly([[x + 27, y + 4], [x + 31, y + 4], [x + 30, y + 8]], ILLU_TEAL);
  s += circle(x + 24, y + 26, 7, ILLU_GOLD, ILLU_BROWN, 1);
  s += circle(x + 24, y + 26, 4, "none", ILLU_BROWN, 1);
  return s;
}
// #10 KTT UK-EU — langit biru + meja + bendera UK + bendera EU.
function illu10(x, y) {
  let s = rect(x, y, 34, 22, ILLU_BLUE);
  s += rect(x, y + 22, 34, 12, ILLU_TAN);
  s += rect(x + 4, y + 24, 26, 4, ILLU_BROWN);
  s += line(x + 11, y + 6, x + 11, y + 24, INK, 1.5);
  s += rect(x + 11, y + 6, 9, 6, ILLU_WHITE);
  s += line(x + 12, y + 6, x + 19, y + 12, ACCENT, 1.5);
  s += line(x + 19, y + 6, x + 12, y + 12, ACCENT, 1.5);
  s += line(x + 23, y + 6, x + 23, y + 24, INK, 1.5);
  s += rect(x + 23, y + 6, 9, 6, "#2E5A8A");
  s += circle(x + 27.5, y + 9, 2, "none", ILLU_GOLD, 1);
  return s;
}
// #12 Huawei OSTA — langit biru + ponsel besar + bintang emas + tanah.
function illu12(x, y) {
  let s = rect(x, y, 34, 22, ILLU_BLUE);
  s += rect(x, y + 22, 34, 12, ILLU_SAGE);
  s += poly(starPts(x + 28, y + 6, 3, 1.2, 5), ILLU_GOLD);
  s += poly(starPts(x + 6, y + 8, 2, 0.8, 5), ILLU_WHITE);
  s += rect(x + 11, y + 5, 12, 24, ILLU_NAVY);
  s += rect(x + 13, y + 7, 8, 16, "#DCE7E0");
  s += poly(starPts(x + 17, y + 15, 4, 1.6, 5), ILLU_GOLD);
  s += line(x + 8, y + 30, x + 26, y + 30, INK, 1.5);
  return s;
}
// #14 Roket USSF-317 — langit malam + bintang + roket di landasan + menara + asap scrub.
function illu14(x, y) {
  let s = rect(x, y, 34, 22, ILLU_NAVY);
  s += rect(x, y + 22, 34, 12, ILLU_TAN);
  s += poly(starPts(x + 6, y + 6, 2.5, 1, 5), ILLU_WHITE);
  s += poly(starPts(x + 29, y + 5, 2, 0.8, 5), ILLU_WHITE);
  s += poly(starPts(x + 28, y + 14, 1.8, 0.7, 5), ILLU_WHITE);
  s += rect(x + 8, y + 6, 3, 18, INK);
  s += rect(x + 8, y + 6, 8, 2, INK);
  s += poly([[x + 17, y + 2], [x + 21, y + 6], [x + 13, y + 6]], ILLU_WHITE);
  s += rect(x + 13, y + 6, 8, 16, ILLU_WHITE);
  s += circle(x + 17, y + 13, 2, ILLU_BLUE, INK, 0.75);
  s += poly([[x + 13, y + 20], [x + 9, y + 27], [x + 13, y + 25]], ACCENT);
  s += poly([[x + 21, y + 20], [x + 25, y + 27], [x + 21, y + 25]], ACCENT);
  s += circle(x + 17, y + 29, 3, "#C9BFA8", null);
  s += circle(x + 22, y + 30, 2.5, "#C9BFA8", null);
  return s;
}
// #15 Youth strike — langit sage + jalan + kepala + papan protes + spanduk.
function illu15(x, y) {
  let s = rect(x, y, 34, 18, ILLU_SAGE);
  s += rect(x, y + 18, 34, 16, ILLU_TAN);
  s += rect(x + 3, y + 2, 11, 5, ILLU_WHITE);
  s += line(x + 8, y + 7, x + 8, y + 15, INK, 1.5);
  for (const [hx, hy] of [[16, 10], [27, 10]]) {
    s += circle(x + hx, y + hy, 3.5, ILLU_CREAM);
    s += rect(x + hx - 5, y + hy + 4, 10, 7, ILLU_DBLUE);
  }
  for (const [hx, hy] of [[10, 21], [19, 19], [28, 21]]) {
    s += circle(x + hx, y + hy, 3.5, ILLU_WHITE);
    s += rect(x + hx - 5, y + hy + 4, 10, 7, ILLU_BROWN);
  }
  s += rect(x + 24, y + 14, 8, 4, ILLU_WHITE);
  s += line(x + 28, y + 18, x + 28, y + 25, INK, 1.5);
  return s;
}
// #16 Globe COP31 — langit teal + matahari + globe + gedung konferensi + daun.
function illu16(x, y) {
  let s = rect(x, y, 34, 18, ILLU_TEAL);
  s += rect(x, y + 18, 34, 16, ILLU_CREAM);
  s += circle(x + 28, y + 6, 3.5, ILLU_GOLD);
  s += rect(x + 3, y + 20, 12, 10, ILLU_BROWN);
  s += poly([[x + 3, y + 20], [x + 9, y + 15], [x + 15, y + 20]], ILLU_TAN);
  s += circle(x + 24, y + 22, 9, ILLU_CREAM);
  s += polyline([[x + 24, y + 13], [x + 21, y + 22], [x + 24, y + 31]], ILLU_TEAL, 1.5);
  s += polyline([[x + 24, y + 13], [x + 27, y + 22], [x + 24, y + 31]], ILLU_TEAL, 1.5);
  s += line(x + 15, y + 22, x + 33, y + 22, ILLU_TEAL, 1.5);
  s += poly([[x + 6, y + 30], [x + 10, y + 30], [x + 8, y + 33]], ILLU_OLIVE);
  return s;
}
// #17 Panggung MAMA — langit malam + sorot lampu + panggung + penonton.
function illu17(x, y) {
  let s = rect(x, y, 34, 20, ILLU_NAVY);
  s += rect(x, y + 20, 34, 14, "#1F2A38");
  s += poly([[x + 17, y + 2], [x + 6, y + 20], [x + 28, y + 20]], ILLU_GOLD, 0.35);
  s += poly(starPts(x + 17, y + 11, 5, 2, 5), ILLU_GOLD);
  s += line(x + 6, y + 26, x + 28, y + 26, ILLU_CREAM, 2);
  s += rect(x + 8, y + 22, 4, 4, ILLU_CREAM);
  s += rect(x + 22, y + 22, 4, 4, ILLU_CREAM);
  for (const cx of [5, 11, 17, 23, 29]) s += circle(x + cx, y + 30, 2, ILLU_CREAM);
  return s;
}
// #18 Kriket — langit sage + tribun + pitch + stumps + bat + bola.
function illu18(x, y) {
  let s = rect(x, y, 34, 12, ILLU_SAGE);
  s += rect(x, y + 12, 34, 6, "#6B8FA8");
  for (const cx of [4, 10, 16, 22, 28]) s += circle(x + cx, y + 15, 1.5, ILLU_WHITE);
  s += rect(x, y + 18, 34, 16, ILLU_CREAM);
  s += rect(x + 6, y + 26, 22, 5, "#E3D3AC");
  for (const sx of [10, 14, 18]) s += rect(x + sx, y + 20, 2, 6, ILLU_GOLD);
  s += poly([[x + 22, y + 8], [x + 27, y + 10], [x + 20, y + 24], [x + 15, y + 22]], ILLU_TAN);
  s += circle(x + 26, y + 28, 3, ACCENT);
  return s;
}
const ILLU = { 4: illu4, 8: illu8, 9: illu9, 10: illu10, 12: illu12, 14: illu14, 15: illu15, 16: illu16, 17: illu17, 18: illu18 };
const ILLU_S8 = 48 / 34; // skala ilustrasi grid 34 -> 48px

// ---------- hero lebar 302x80 ----------
// Hero #1 Japan CPI: bendera Jepang besar + batang CPI naik + koin emas +
// skyline Tokyo + matahari pagi.
function illuHeroJapanWide(x, y, w = 302, h = 80) {
  let s = rect(x, y, w, h, "#DCE7E0");
  s += circle(x + 272, y + 16, 9, "#E8A33D");
  s += rect(x, y + 62, w, 8, "#3E5C4C");
  for (const [bx, bw, bh] of [[8, 14, 10], [26, 10, 16], [40, 16, 8], [240, 12, 14], [256, 10, 20], [270, 16, 10], [290, 8, 12]]) {
    s += rect(x + bx, y + 62 - bh, bw, bh, "#3E5C4C");
  }
  s += rect(x + 14, y + 10, 120, 52, ILLU_WHITE);
  s += circle(x + 74, y + 36, 15, "#BC002D");
  const bars = [12, 20, 28, 38];
  bars.forEach((bh, i) => {
    const bx = x + 150 + i * 28;
    s += rect(bx, y + 62 - bh, 20, bh, ILLU_TEAL);
  });
  s += polyline([[x + 150, y + 54], [x + 178, y + 46], [x + 206, y + 36], [x + 234, y + 26]], ILLU_TEAL, 3);
  s += poly([[x + 228, y + 26], [x + 238, y + 26], [x + 234, y + 33]], ILLU_TEAL);
  s += circle(x + 276, y + 52, 13, ILLU_GOLD, ILLU_BROWN, 1.5);
  s += circle(x + 276, y + 52, 7, "none", ILLU_BROWN, 1);
  s += line(x, y + 70, x + w, y + 70, INK, 1.5);
  return s;
}
// Hero #2 Taiwan crash (BARU v3): langit merah muda pucat + Taipei 101 +
// batang bursa JATUH (merah) + panah turun besar + koin retak.
// Taipei 101: menara berundak (5 tingkat menyempit) + puncak runcing.
function illuHeroTaipeiWide(x, y, w = 302, h = 80) {
  let s = rect(x, y, w, h, "#F6DFD8"); // langit merah muda (pasar jatuh)
  s += rect(x, y + 62, w, 18, "#3E2A24"); // tanah gelap
  // Skyline Taipei (sisi kiri, gelap).
  for (const [bx, bw, bh] of [[8, 16, 12], [28, 12, 20], [44, 18, 9], [248, 14, 16], [266, 12, 10], [282, 14, 18]]) {
    s += rect(x + bx, y + 62 - bh, bw, bh, "#3E2A24");
  }
  // Taipei 101 di tengah-kiri: 5 undakan menyempit (tiap 7px) + puncak runcing.
  const t101x = 78;
  const tiers = [[0, 44], [4, 36], [8, 28], [12, 20], [16, 12]];
  tiers.forEach(([dx, tw], i) => {
    s += rect(x + t101x + dx, y + 62 - (i + 1) * 7, tw, 7, "#5A3A30");
  });
  s += poly([[x + t101x + 18, y + 62 - 35], [x + t101x + 26, y + 62 - 35], [x + t101x + 22, y + 62 - 48]], "#5A3A30");
  // Batang bursa jatuh (kiri->kanan menurun) + garis turun + panah.
  const bars = [46, 38, 28, 18, 10];
  bars.forEach((bh, i) => {
    const bx = x + 150 + i * 26;
    s += rect(bx, y + 62 - bh, 18, bh, ACCENT);
  });
  s += polyline([[x + 150, y + 18], [x + 176, y + 28], [x + 202, y + 38], [x + 228, y + 48], [x + 254, y + 56]], ACCENT, 3);
  s += poly([[x + 248, y + 56], [x + 258, y + 56], [x + 254, y + 48]], ACCENT);
  // Tanpa teks angka di dalam ilustrasi (konsisten hero #1/#3): angka -6.22%
  // sudah ada di headline hero + stat strip.
  s += line(x, y + 70, x + w, y + 70, INK, 1.5);
  return s;
}
// Hero #3 China LPR: grafik naik lebar (5 bar + garis + koin emas) + skyline malam.
function illuHeroChartWide(x, y, w = 302, h = 80) {
  let s = rect(x, y, w, h, ILLU_GOLD_BG);
  s += rect(x, y + 66, w, 14, "#2E3A4A");
  for (const [bx, bw, bh] of [[8, 12, 10], [24, 10, 16], [260, 12, 12], [276, 10, 18]]) {
    s += rect(x + bx, y + 66 - bh, bw, bh, "#2E3A4A");
  }
  const bars = [18, 28, 36, 46, 58];
  bars.forEach((bh, i) => {
    const bx = x + 24 + i * 44;
    s += rect(bx, y + 66 - bh, 30, bh, ILLU_TEAL);
  });
  s += polyline([[x + 24, y + 60], [x + 68, y + 48], [x + 112, y + 40], [x + 156, y + 30], [x + 200, y + 20], [x + 244, y + 12]], ILLU_TEAL, 3);
  s += poly([[x + 238, y + 12], [x + 248, y + 12], [x + 244, y + 19]], ILLU_TEAL);
  s += circle(x + 272, y + 52, 15, ILLU_GOLD, ILLU_BROWN, 1.5);
  s += circle(x + 272, y + 52, 9, "none", ILLU_BROWN, 1);
  s += line(x, y + 66, x + w, y + 66, INK, 1.5);
  return s;
}

// ---------- kartu grid ----------
// Ilustrasi 48px di kiri sel + frame INK 2px + badge nomor 18x18 di sudut
// kiri atas + headline 14px + pill kicker 11px + chip status filled di kanan
// pill (REPORTED hijau / FORECAST biru / CLAIM oranye, teks putih 9px).
// Lebar kicker+chip ≤ 234px (kicker terpanjang dicek di verifier).
function gridCard(it, colX, y) {
  let s = "";
  s += `<g transform="translate(${colX},${y - 14 + OY}) scale(${ILLU_S8.toFixed(4)})">${ILLU[it.illu](0, -OY)}</g>`;
  s += `<rect x="${colX}" y="${y - 14 + OY}" width="48" height="48" fill="none" stroke="${INK}" stroke-width="2"/>`;
  s += `<rect x="${colX - 2}" y="${y - 16 + OY}" width="18" height="18" fill="${ACCENT}"/>`;
  s += text(colX + 7, y - 4, String(it.n), { size: 12, weight: 800, fill: "#FFFFFF", anchor: "middle" });
  const maxW = 296 - 62;
  const lines = wrap(it.headline, maxW, 14, 400);
  let head = lines[0] || "";
  if (lines.length > 1) head = (wrap(it.headline, maxW - 14, 14, 400)[0] || "") + "…";
  s += text(colX + 62, y, head, { size: 14, weight: 400, fill: INK });
  const data = it.kicker || "WORLD";
  const dw = Math.round(data.length * 7.5 + 14);
  s += `<rect x="${colX + 62}" y="${y + 7 + OY}" width="${dw}" height="15" rx="7" fill="none" stroke="${MUTED}" stroke-width="1"/>`;
  s += text(colX + 62 + 7, y + 18, data, { size: 11, weight: 700, fill: MUTED, spacing: 1 });
  const st = it.status && it.status.label;
  if (st && STATUS_FILL[st]) {
    const sw = Math.round(st.length * 5 + 12);
    const sx = colX + 62 + dw + 8;
    if (sx + sw > colX + 296) console.error(`gridStatus: kartu #${it.n} kicker+chip melebihi sel (${sx + sw - colX} > 296) — pendekkan kicker`);
    s += `<rect x="${sx}" y="${y + 7 + OY}" width="${sw}" height="15" rx="7" fill="${STATUS_FILL[st]}"/>`;
    s += text(sx + sw / 2, y + 18, st, { size: 9, weight: 800, fill: "#FFFFFF", anchor: "middle" });
  }
  return { s, truncated: lines.length > 1, head };
}

// ---------- chip status hero ----------
// "LABEL · SUMBER" (CLAIM merah / CONFIRMED INK), rata kanan kolom hero,
// sejajar kicker. Kicker harus cukup pendek agar chip muat.
function statusChip(h, hx, heroW) {
  const st = h.status;
  if (!st || !st.label || !st.source) return "";
  const label = `${st.label} · ${st.source}`;
  const tw = Math.round(label.length * 9 * 0.56);
  const cw = tw + 12;
  const cx = hx + heroW - cw;
  const cy = 326 - 11;
  const kw = textW(h.kicker || "", 11, 800) + (h.kicker || "").length;
  if (kw + 8 + cw > heroW) console.error(`statusChip: hero #${h.n} kicker+chip melebihi kolom (${kw}+${cw} > ${heroW}) — pendekkan kicker`);
  const fill = st.label === "CLAIM" ? ACCENT : INK;
  let s = `<rect x="${cx}" y="${cy + OY}" width="${cw}" height="14" rx="7" fill="${fill}"/>`;
  s += text(cx + cw / 2, 326, label, { size: 9, weight: 800, fill: "#FFFFFF", anchor: "middle" });
  return s;
}

function build(d) {
  const heroes = d.heroes; // 3 hero: #1 Japan CPI, #2 Taiwan crash, #3 China LPR
  const grid = d.grid.slice(0, 10); // n=4..13
  const brief = d.brief; // n=14..N (28-32 item, 7-8 baris tail)
  const items = grid.map((g) => ({ n: g.n, headline: g.headline, kicker: g.kicker, illu: g.illu, status: g.status }));
  const allStories = [
    ...heroes.map((h) => ({ n: h.n, headline: h.headline, kicker: h.kicker })),
    ...grid.map((g) => ({ n: g.n, headline: g.headline, kicker: g.kicker })),
    ...brief.map((b) => ({ n: b.n, headline: b.headline, kicker: b.kicker })),
  ];
  const contCounts = { NA: 0, SA: 0, EU: 0, AF: 0, AS: 0, OC: 0 };
  let offCont = 0;
  for (const it of allStories) {
    const c = continentOf(it);
    if (c === undefined) console.error(`final: cerita #${it.n} tidak terpetakan ke benua: ${it.headline}`);
    else if (c === null) offCont++;
    else contCounts[c]++;
  }
  const storyCount = heroes.length + grid.length + brief.length;
  d.countLine = `${storyCount} STORIES · SIX CONTINENTS`;
  const truncated = [];
  let s = "";
  s += `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
  s += masthead(d);

  // ---- Stat strip: 6 kotak (148px, gap 8), angka 26px + label 11px ----
  d.stats.forEach(({ num, label: lab }, i) => {
    const bx = 48 + i * 156;
    s += `<rect x="${bx}" y="${160 + OY}" width="148" height="48" rx="2" fill="none" stroke="${INK}" stroke-width="1.5"/>`;
    s += text(bx + 12, 184, num, { size: 26, weight: 800, fill: ACCENT });
    s += text(bx + 12, 200, lab, { size: 11, weight: 700, fill: INK, spacing: 1 });
  });

  // ---- Region bar GEOGRAFIS: nama MUTED + angka ACCENT, jumlah = total ----
  {
    let rx = 48;
    d.regionBar.forEach((r, i) => {
      s += text(rx, 224, r.name, { size: 12, weight: 700, fill: MUTED });
      rx += textW(r.name, 12, 700) + 6;
      s += text(rx, 224, String(r.count), { size: 12, weight: 800, fill: ACCENT });
      rx += textW(String(r.count), 12, 800) + 6;
      if (i < d.regionBar.length - 1) {
        s += text(rx, 224, "·", { size: 12, weight: 700, fill: MUTED });
        rx += textW("·", 12, 700) + 6;
      }
    });
  }

  // ---- 3 hero berdampingan (kolom 302px, gap 11) ----
  const heroCols = [48, 361, 674];
  const heroW = 302, heroIllusY = 230, heroIllusH = 80;
  heroes.forEach((h, i) => {
    const hx = heroCols[i];
    if (h.illu === "flags") s += illuHeroJapanWide(hx, heroIllusY, heroW, heroIllusH);
    else if (h.illu === "taipei") s += illuHeroTaipeiWide(hx, heroIllusY, heroW, heroIllusH);
    else if (h.illu === "chart") s += illuHeroChartWide(hx, heroIllusY, heroW, heroIllusH);
    s += `<rect x="${hx}" y="${heroIllusY + OY}" width="${heroW}" height="${heroIllusH}" fill="none" stroke="${INK}" stroke-width="2"/>`;
    s += `<rect x="${hx - 2}" y="${heroIllusY - 2 + OY}" width="18" height="18" fill="${ACCENT}"/>`;
    s += text(hx + 7, heroIllusY + 10, String(h.n), { size: 12, weight: 800, fill: "#FFFFFF", anchor: "middle" });
    s += text(hx, 326, h.kicker, { size: 11, weight: 800, fill: ACCENT, spacing: 1 });
    s += statusChip(h, hx, heroW);
    const hl = wrap(h.headline, heroW, 22, 700);
    if (hl.length > 2) truncated.push("hero" + h.n);
    hl.slice(0, 2).forEach((ln, j) => { s += text(hx, 350 + j * 24, ln, { size: 22, weight: 700, fill: INK }); });
    const dl = wrap(h.dek, heroW, 13, 400).slice(0, 1);
    if ((dl[0] || "") !== h.dek) truncated.push("hero" + h.n + "dek");
    s += text(hx, 394, dl[0] || "", { size: 13, weight: 400, fill: MUTED });
  });

  // ---- Label seksi grid (418..442) ----
  s += rect(48, 418, 200, 24, ACCENT);
  s += text(148, 435, d.gridTitle, { size: 15, weight: 800, fill: "#FFFFFF", anchor: "middle", spacing: 1 });

  // ---- Grid: 10 kartu (#4..13), 3 kol x 4 baris, pitch 57 ----
  const cols = [48, 364, 680];
  const rows = [460, 517, 574, 631];
  s += line(354, 447, 354, 656, MUTED, 1, 0.5);
  s += line(669, 447, 669, 656, MUTED, 1, 0.5);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      const idx = r * 3 + c;
      if (idx < items.length) {
        const f = gridCard(items[idx], cols[c], rows[r]);
        s += f.s;
        if (f.truncated) truncated.push(items[idx].n);
      } else if (r === 3 && c === 1) {
        // Kotak navy THE VERDICT menggantikan 2 sel filler baris-4.
        // 612x48 (x 364..976, GEN y 617..665). Judul ≤ ~80 kar, detail ≤ ~105 kar.
        const v = d.verdict || { title: "", detail: "" };
        s += `<rect x="364" y="${617 + OY}" width="612" height="48" fill="${ILLU_NAVY}"/>`;
        s += text(376, 637, `THE VERDICT — ${v.title}`, { size: 13, weight: 800, fill: "#FFFFFF" });
        s += text(376, 655, v.detail, { size: 11, weight: 400, fill: "#FFFFFF" });
        if (textW(`THE VERDICT — ${v.title}`, 13, 800) > 588) truncated.push("verdict-title");
        if (textW(v.detail, 11, 400) > 588) truncated.push("verdict-detail");
      }
    }
  }

  // ---- Paruh bawah MENGALIR (cursor GEN). Grid berakhir 665. ----
  // Peta band: judul + peta 460x90 + legenda 2 kolom di kanan peta.
  const mapTitleY = 681;
  const mapY = 689, mapH = 90, mapW = 460;
  s += text(48, mapTitleY, d.mapTitle, { size: 15, weight: 800, fill: ACCENT, spacing: 1 });
  s += worldMapBand(d, 48, mapY, mapW, mapH);
  const pinLabels = d.pinLabels; // [{n, label}] — 9 pin bernomor
  pinLabels.forEach((pl, i) => {
    const lx = i < 5 ? 524 : 750;
    const ly = 703 + (i % 5) * 20;
    s += `<rect x="${lx}" y="${ly - 11 + OY}" width="14" height="14" fill="${ACCENT}"/>`;
    s += text(lx + 7, ly, String(pl.n), { size: 10, weight: 800, fill: "#FFFFFF", anchor: "middle" });
    s += text(lx + 20, ly, pl.label, { size: 12, weight: 400, fill: INK });
  });

  // ---- Timeline "THE DAY IN UTC": 6 slot, pitch dinamis 928/slot ----
  const tlTitleY = mapY + mapH + 18; // 797
  const tlSlotY = tlTitleY + 16; // 813
  s += text(48, tlTitleY, "THE DAY IN UTC", { size: 12, weight: 800, fill: ACCENT, spacing: 1 });
  s += line(170, tlTitleY - 6, 976, tlTitleY - 6, MUTED, 1, 0.5);
  const tlPitch = 928 / d.timeline.length;
  d.timeline.forEach((t, i) => {
    const tx = 48 + i * tlPitch;
    s += text(tx, tlSlotY, t.time, { size: 11, weight: 800, fill: ACCENT });
    s += text(tx + textW(t.time, 11, 800) + 12, tlSlotY, t.label, { size: 11, weight: 400, fill: INK });
    if (textW(t.time, 11, 800) + 12 + textW(t.label, 11, 400) > tlPitch - 4) truncated.push("timeline" + i);
  });

  // ---- Tail: brief bernomor urut, 4 kol, pitch 13, font 12px ----
  // Baris = ceil(brief/4) (7 baris utk 28 brief, 8 baris utk 32 brief).
  // Kolom 232px; headline 1 baris ≤ ~31 kar (wrap 212-numW).
  const tailTitleY = tlSlotY + 18; // 831
  const tailRows = Math.ceil(brief.length / 4);
  const tailFirst = tailTitleY + 14; // 845
  const tailPitch = 13;
  s += text(48, tailTitleY, d.briefTitle, { size: 15, weight: 800, fill: ACCENT, spacing: 1 });
  const tailCols = [48, 280, 512, 744];
  for (let r = 0; r < tailRows; r++) {
    const ry = tailFirst + r * tailPitch;
    if (r % 2 === 0) s += rect(48, ry - 12, 928, 13, BAND);
    for (let c = 0; c < 4; c++) {
      const it = brief[r * 4 + c];
      if (!it) continue;
      const x0 = tailCols[c];
      const numW = Math.round(String(it.n).length * 7.2 + 12);
      s += text(x0, ry, String(it.n), { size: 12, weight: 800, fill: ACCENT });
      const bl = wrap(it.headline, 212 - numW, 12, 400);
      if (bl.length > 1) truncated.push(it.n);
      s += text(x0 + numW, ry, bl[0] || "", { size: 12, weight: 400, fill: INK });
    }
  }
  const lastTailRow = tailFirst + (tailRows - 1) * tailPitch;

  // ---- DATE CHECK box merah (2 baris, 36px): 4-8 item high-salience ----
  // Baris 1: alasan + item bertanggal. Baris 2: sisa item + "Not yet:".
  const dcY = lastTailRow + 12;
  const notYetLine = d.notYet ? `Not yet: ${d.notYet}` : "";
  s += `<rect x="48" y="${dcY + OY}" width="928" height="36" fill="${ACCENT}"/>`;
  s += text(60, dcY + 14, d.dateCheck, { size: 11, weight: 800, fill: "#FFFFFF" });
  s += text(60, dcY + 30, `${d.dateCheck2} ${notYetLine}`, { size: 11, weight: 400, fill: "#FFFFFF" });

  // ---- Footer: sumber + HOW SURE ----
  const footRuleY = dcY + 44;
  s += rect(48, footRuleY, 928, 2, ACCENT);
  s += text(48, footRuleY + 13, `${d.footer} · ${d.countLine}`, { size: 12, weight: 400, fill: MUTED });
  s += text(48, footRuleY + 26, d.footer2, { size: 12, weight: 400, fill: MUTED });
  const bottom = footRuleY + 26; // GEN
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s}</svg>`, bottom, storyCount, truncated, contCounts, offCont, tailRows };
}

// ---------- gate overlap (teks-vs-teks) ----------
function overlapAudit() {
  const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  const texts = boxes.filter((b) => b.kind === "text");
  const issues = [];
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      if (hit(texts[i], texts[j])) issues.push(`teks-vs-teks: "${texts[i].label}" <> "${texts[j].label}"`);
    }
  }
  return issues;
}

const [,, jsonPath, outPng, outSvg] = process.argv;
if (!jsonPath || !outPng) { console.error("usage: node generate-v3.mjs <news-v3.json> <out.png> [out.svg]"); process.exit(1); }
const d = JSON.parse(readFileSync(jsonPath, "utf8"));
console.error(`stories in file: ${d.heroes.length + d.grid.length + d.brief.length} (heroes ${d.heroes.length} + grid ${d.grid.length} + brief ${d.brief.length}), pins ${d.pins.length} + grey dots ${d.greyDots.length}`);
console.error(`constants: phi=${PHI}, pi=${PI}, golden angle=${GOLDEN_ANGLE.toFixed(5)} deg`);
const built = build(d);
console.error(`final: bottom y=${built.bottom} GEN (rendered ${built.bottom + OY}, margin bawah ${1024 - (built.bottom + OY)}px), total stories shown=${built.storyCount}, tail rows=${built.tailRows}, truncated: ${built.truncated.length ? built.truncated.join(",") : "none"}, continents NA ${built.contCounts.NA} / SA ${built.contCounts.SA} / EU ${built.contCounts.EU} / AF ${built.contCounts.AF} / AS ${built.contCounts.AS} / OC ${built.contCounts.OC} (off-continent ${built.offCont})`);
if (built.bottom + OY > 1004) console.error(`WARNING: layout overflow, rendered bottom y=${built.bottom + OY} > 1004 (margin < 20px)`);
else console.error(`layout ok, rendered bottom y=${built.bottom + OY} (margin bawah ${1024 - (built.bottom + OY)}px, atas 32px)`);
const issues = overlapAudit();
if (issues.length) { console.error(`OVERLAP GATE: ${issues.length} issue(s):`); for (const i of issues) console.error(`  - ${i}`); }
else console.error("OVERLAP GATE: 0 issues (teks-vs-teks)");
const svg = built.svg;
if (outSvg) writeFileSync(outSvg, svg);
const r = new Resvg(svg, { fitTo: { mode: "width", value: 1024 }, font: { loadSystemFonts: true } });
const png = r.render().asPng();
writeFileSync(outPng, png);
// Post-step: resvg emits RGBA dengan alpha 100% opaque — strip ke RGB +
// zlib level 9 via PIL. Lossless, pixel-identical, deterministik.
execSync(`python3 -c 'from PIL import Image; im = Image.open(${JSON.stringify(outPng)}).convert("RGB"); im.save(${JSON.stringify(outPng)}, optimize=True, compress_level=9)'`, { stdio: "pipe" });
const pngOpt = readFileSync(outPng);
console.log(`wrote ${outPng}: ${pngOpt.length} bytes (${(pngOpt.length / 1024).toFixed(0)} KiB, limit 1024 KiB) [RGB+zlib9, was ${png.length}]`);
