// verify-v3.mjs — independent verification of entry-final-v3.png (TOP-25 ATTEMPT).
// Ditulis penuh di sesi ini, diadaptasi dari pola verify-v2 (koordinat v3):
//   Gate baru v3:
//     V1. 45 cerita (3 hero + 10 grid + 32 brief), tail bernomor URUT 14..45
//         tanpa bolong (pelajaran v13 + autopsi §4.3).
//     V2. DATE CHECK 2 baris, 7 pengecualian bertanggal "(19/11" (4-8 item,
//         high-salience saja) + "Not yet:" di baris 2.
//     V3. Byte cap situs 1 MiB (RULES.txt 20 Nov); target < 700 KB.
//     V4. Hero #2 = Taipei (bg #F6DFD8), tanpa art vaporwave (clipPath 0).
//     V5. Grid pitch 57 (bukan 58); peta band 460x90 (bukan 300x110);
//         tail pitch 13, 8 baris, font 12px.
// Gate lama dipertahankan: determinisme, no truncasi, masthead, stat strip,
// heroes + chip, grid + chip status, peta (9 pin + dot abu), timeline 6 slot,
// VERDICT navy, footer, kontras, TAIL GAP piksel nyata.
// Usage: node verify-v3.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
let PASS = 0, FAIL = 0;
function gate(name, ok, detail = "") {
  if (ok) { PASS++; console.log(`PASS ${name}${detail ? " — " + detail : ""}`); }
  else { FAIL++; console.log(`FAIL ${name}${detail ? " — " + detail : ""}`); }
}

// 1. Determinism: render twice into /tmp, compare with the deliverable.
execSync("node generate-v3.mjs news-v3.json /tmp/v3-a.png /tmp/v3-a.svg", { stdio: "pipe" });
execSync("node generate-v3.mjs news-v3.json /tmp/v3-b.png /tmp/v3-b.svg", { stdio: "pipe" });
const a = readFileSync("/tmp/v3-a.png"), b = readFileSync("/tmp/v3-b.png");
const main = readFileSync("entry-final-v3.png");
gate("determinism a==b", sha(a) === sha(b));
gate("determinism a==entry-final-v3", sha(a) === sha(main));
console.log(`entry-final-v3.png sha256: ${sha(main)}`);
gate("size ≤ 1 MiB (cap situs)", main.length <= 1048576, `${main.length} bytes (${(main.length / 1024).toFixed(1)} KiB)`);
gate("size < 700 KB (target v3)", main.length < 700 * 1024, `${main.length} bytes`);

// 2. No truncation in the SVG.
const svg = readFileSync("entry-final-v3.svg", "utf8");
gate("no truncation … in SVG", !svg.includes("…"));

// 2b. Masthead: tanggal Didone 54px terpusat + dek merah miring.
const dateEl = [...svg.matchAll(/<text x="512" y="96" font-family="Playfair Display" font-size="54" font-weight="900"[^>]*>([^<]*)<\/text>/g)];
gate("masthead tanggal Didone 54px", dateEl.length === 1, dateEl[0] ? `"${dateEl[0][1]}"` : "?");
const dateW = dateEl[0] ? dateEl[0][1].length * 54 * 0.60 : 0;
gate("lebar tanggal ≤ 928", dateW <= 928, `${Math.round(dateW)}px`);
const dekEl = [...svg.matchAll(/<text x="512" y="124"[^>]*font-style="italic"[^>]*>([^<]*)<\/text>/g)];
gate("dek merah miring", dekEl.length === 1);

// 2c. Stat strip: 6 kotak 148x48, angka 26px + label 11px.
const statBoxes = [...svg.matchAll(/<rect x="(\d+)" y="144" width="148" height="48" rx="2" fill="none" stroke="#2E2118" stroke-width="1.5"\/>/g)];
gate("stat boxes 148x48 = 6", statBoxes.length === 6, `${statBoxes.length}`);
const statNums = [...svg.matchAll(/<text x="(\d+)" y="(168)" font-family="Noto Sans, sans-serif" font-size="26" font-weight="800" fill="#BC2F0E"[^>]*>([^<]*)<\/text>/g)];
gate("stat numbers 26px = 6", statNums.length === 6, statNums.map((m) => m[3]).join(", "));
const statW = statNums.map((m) => ({ num: m[3], w: Math.round(m[3].length * 26 * 0.56) }));
gate("stat numbers muat di kotak", statW.every((s) => s.w + 12 + 8 <= 148), statW.map((s) => `${s.num}=${s.w}px`).join(", "));

// 2d. Heroes: 3 kartu (ilustrasi 302x80 + frame + badge 18x18).
const heroFrames = [...svg.matchAll(/<rect x="(\d+)" y="214" width="302" height="80" fill="none" stroke="#2E2118" stroke-width="2"\/>/g)];
gate("hero frames 302x80 = 3", heroFrames.length === 3, `${heroFrames.length}`);
const heroArt = [...svg.matchAll(/<clipPath id="heroArtClip">/g)];
gate("tanpa art vaporwave (clipPath 0)", heroArt.length === 0, `${heroArt.length}`);
const heroJapan = [...svg.matchAll(/<rect x="(\d+)" y="214" width="302" height="80" fill="#DCE7E0"\/>/g)];
const heroTaipei = [...svg.matchAll(/<rect x="(\d+)" y="214" width="302" height="80" fill="#F6DFD8"\/>/g)];
const heroChart = [...svg.matchAll(/<rect x="(\d+)" y="214" width="302" height="80" fill="#F2E3C0"\/>/g)];
gate("hero Japan + Taipei + chart bg (1/1/1)", heroJapan.length === 1 && heroTaipei.length === 1 && heroChart.length === 1, `Japan ${heroJapan.length}, Taipei ${heroTaipei.length}, chart ${heroChart.length}`);

// 2e. Ilustrasi grid: 10 kartu 48x48 via <g scale(1.4118)> + frame + badge.
const illuGrid = [...svg.matchAll(/<g transform="translate\([\d.,-]+\) scale\(1\.4118\)">/g)];
gate("ilustrasi grid 48x48 = 10", illuGrid.length === 10, `${illuGrid.length}`);
const frames48 = [...svg.matchAll(/<rect[^>]*width="48" height="48" fill="none" stroke="#2E2118" stroke-width="2"[^>]*>/g)];
gate("frame INK 2px grid 48x48 = 10", frames48.length === 10, `${frames48.length}`);
const badgeRects = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="18" height="18" fill="#BC2F0E"\/>/g)];
// Badge nomor duduk di y rendered 212 (hero) atau rowBase-16 grid (428/485/542/599).
// Batang ke-4 grafik hero Taipei juga 18x18 ACCENT (y=258) — BUKAN badge.
const badges = badgeRects.filter((m) => [212, 428, 485, 542, 599].includes(+m[2]));
gate("badge nomor 18x18 = 13", badges.length === 13, `${badges.length} (total rect 18x18 ACCENT: ${badgeRects.length}, 1 = batang grafik Taipei)`);
const badgeNums = [...svg.matchAll(/<text[^>]*font-size="12" font-weight="800" fill="#FFFFFF"[^>]*>([^<]*)<\/text>/g)].filter((m) => /^\d+$/.test(m[1]));
gate("angka badge 12px = 13", badgeNums.length === 13, badgeNums.map((m) => m[1]).join(","));

// 2e2. Chip status hero: 3 chip 14px (CLAIM merah / CONFIRMED INK).
const statusChips = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="14" rx="7" fill="(#[0-9A-F]{6})"\/>/g)];
gate("chip status hero 14px = 3", statusChips.length === 3, `${statusChips.length}`);
const statusTexts = [...svg.matchAll(/<text[^>]*font-size="9" font-weight="800" fill="#FFFFFF"[^>]*>([^<]*)<\/text>/g)];
const heroChipTexts = statusTexts.filter((m) => /^(CLAIM|CONFIRMED) · /.test(m[1]));
gate("teks chip hero 3 (LABEL · SUMBER)", heroChipTexts.length === 3, heroChipTexts.map((m) => m[1]).join(" | "));

// 2e3. Chip status grid: 10 pill filled 15px di kanan pill kicker.
const gridPills = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="15" rx="7" fill="(#[0-9A-F]{6})"\/>/g)];
gate("pill status grid filled = 10", gridPills.length === 10, `${gridPills.length} (fills: ${gridPills.map((m) => m[4]).join(",")})`);
const gridChipTexts = statusTexts.filter((m) => /^(REPORTED|FORECAST|CLAIM)$/.test(m[1]));
gate("teks chip grid 9px = 10", gridChipTexts.length === 10, gridChipTexts.map((m) => m[1]).join(","));
gate("total teks chip 9px = 13 (3 hero + 10 grid)", statusTexts.length === 13, `${statusTexts.length}`);

// 3. Peta band v3: kotak x 48..508, rendered y 673..763 (GEN 689..779).
// Pin = lingkaran merah r=8 + angka putih 10px (9 pin); dot brief = abu r=3 (19).
const mapTexts = [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*font-size="10" font-weight="800" fill="#FFFFFF"[^>]*>([^<]*)<\/text>/g)]
  .filter((m) => +m[1] >= 48 && +m[1] <= 508 && +m[2] >= 673 && +m[2] <= 763);
gate("angka pin di peta = 9", mapTexts.length === 9, mapTexts.map((m) => m[3]).join(","));
const pins = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="8" fill="#BC2F0E"/g)];
gate("pin merah r=8 = 9", pins.length === 9, `${pins.length}`);
const pinClipped = pins.filter((m) => {
  const cx = +m[1], cy = +m[2];
  return cx - 9.5 < 48 || cx + 9.5 > 508 || cy - 9.5 < 673 || cy + 9.5 > 763;
});
gate("pin utuh (tidak terpotong tepi)", pinClipped.length === 0, pinClipped.length ? JSON.stringify(pinClipped) : "9/9 utuh");
const greyDots = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="3" fill="#8A7F6A"/g)];
gate("dot abu r=3 ≥ 19", greyDots.length >= 19, `${greyDots.length}`);

// 3b. Grid v3: pitch 57, ilustrasi 48px, headline 14px, chip 15px.
const chips = [...svg.matchAll(/<rect x="(\d+)" y="([\d.]+)" width="(\d+)" height="15" rx="7"/g)].map((m) => ({ x: +m[1], y: +m[2] }));
const heads = [...svg.matchAll(/<text x="(\d+)" y="([\d.]+)" font-family="Noto Sans, sans-serif" font-size="14" font-weight="400"[^>]*>([^<]*)<\/text>/g)]
  .map((m) => ({ x: +m[1], y: +m[2] })).filter((h) => h.y >= 430 && h.y <= 640);
const rowBases = [...new Set(heads.map((h) => h.y))].sort((x, y) => x - y);
gate("grid row baselines pitch 57", rowBases.length === 4 && rowBases[1] - rowBases[0] === 57, rowBases.join(", "));
const illuGaps = [], badgeGaps = [];
for (let i = 0; i < rowBases.length - 1; i++) {
  illuGaps.push((rowBases[i + 1] - 14) - (rowBases[i] + 34));
  badgeGaps.push((rowBases[i + 1] - 16) - (rowBases[i] + 34));
}
gate("celah ilustrasi->ilustrasi ≥8px", illuGaps.every((g) => g >= 8), illuGaps.map((g) => g.toFixed(1)).join(" / "));
gate("celah ilustrasi->badge ≥6px", badgeGaps.every((g) => g >= 6), badgeGaps.map((g) => g.toFixed(1)).join(" / "));
const chipTops = chips.filter((c) => c.y >= 420 && c.y <= 620).map((c) => c.y);
const hcGaps = chipTops.map((t) => {
  const rb = Math.max(...rowBases.filter((r) => r <= t));
  return t - (rb + 3.5);
});
const hcGap = Math.min(...hcGaps);
gate("headline->chip gap ≥3px", hcGap >= 3, `terkecil ${hcGap.toFixed(2)}px`);
const kickTexts = [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)" font-family="Noto Sans, sans-serif" font-size="11" font-weight="700" fill="#6B5844"[^>]*>/g)]
  .map((m) => ({ x: +m[1], y: +m[2] })).filter((t) => t.y >= 430 && t.y <= 640);
const kickOk = kickTexts.filter((t) => chips.some((c) => Math.abs(c.x + 7 - t.x) < 1 && Math.abs(c.y + 11 - t.y) < 1));
gate("kicker texts on chips 10/10", kickOk.length === 10, `${kickOk.length} of 10`);

// 3c. Timeline v3: 6 slot (time + label, pitch 928/6), DATE CHECK 2 baris, footer.
const tlTimes = [...svg.matchAll(/<text x="([\d.]+)" y="797" font-family="Noto Sans, sans-serif" font-size="11" font-weight="800" fill="#BC2F0E"[^>]*>([^<]*)<\/text>/g)];
gate("timeline times = 6", tlTimes.length === 6, tlTimes.map((m) => m[2]).join(" | "));
const dcBox = [...svg.matchAll(/<rect x="48" y="932" width="928" height="36" fill="#BC2F0E"\/>/g)];
gate("DATE CHECK box merah 928x36 (2 baris)", dcBox.length === 1, `${dcBox.length}`);
const dcTexts = [...svg.matchAll(/<text x="60" y="(946|962)"[^>]*fill="#FFFFFF"[^>]*>([^<]*)<\/text>/g)];
gate("DATE CHECK lines putih = 2", dcTexts.length === 2, `${dcTexts.length}`);
const dcLine1 = dcTexts.find((m) => m[1] === "946");
const dcLine2 = dcTexts.find((m) => m[1] === "962");
const datedCount = dcTexts.reduce((n, m) => n + (m[2].split("(19/11").length - 1), 0);
gate("[v3 V2] DATE CHECK pengecualian bertanggal 4-8", datedCount >= 4 && datedCount <= 8, `${datedCount} tag "(19/11"`);
gate("DATE CHECK baris 1 alasan (first reported)", (dcLine1 ? dcLine1[2] : "").includes("first reported"), dcLine1 ? dcLine1[2].slice(0, 60) : "?");
gate("DATE CHECK baris 2 mengandung Not yet:", (dcLine2 ? dcLine2[2] : "").includes("Not yet:"), dcLine2 ? dcLine2[2].slice(0, 60) : "?");
gate("footer Original drawings", svg.includes("Original drawings"));
gate("footer legenda CLAIM", svg.includes("CLAIM = one side's account"));
gate("footer sumber 8 media", ["Reuters", "AP", "AFP", "BBC", "The Hindu", "IMD", "Bloomberg", "NWS"].every((s) => svg.includes(s)));
gate("footer hitungan 45 STORIES · SIX CONTINENTS", svg.includes("45 STORIES · SIX CONTINENTS"));

// 3d. Kotak navy THE VERDICT 612x48 (x 364, rendered y 601..649).
const verdictBox = [...svg.matchAll(/<rect x="364" y="601" width="612" height="48" fill="#2E3A4A"\/>/g)];
gate("kotak VERDICT navy 612x48", verdictBox.length === 1, `${verdictBox.length}`);
gate("teks THE VERDICT —", svg.includes("THE VERDICT — "));

// 4. Contrast (WCAG from hex — flat colors, exact).
function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = c.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function cx(fg, bg) { const x = lum(fg), y = lum(bg); const [hi, lo] = x > y ? [x, y] : [y, x]; return (hi + 0.05) / (lo + 0.05); }
const PAPER = "#F2E8D5", INK = "#2E2118", MUTED = "#6B5844", ACCENT = "#BC2F0E", DEK = "#3D2C1E";
const SEA = "#E9F1EA", LAND = "#5C8A74", LAND2 = "#4C7A64", LAND3 = "#63917A";
console.log(`map land-vs-chip: LAND ${cx(LAND, SEA).toFixed(2)}:1 | LAND2 ${cx(LAND2, SEA).toFixed(2)}:1 | LAND3 ${cx(LAND3, SEA).toFixed(2)}:1 (target >=3:1 non-teks)`);
console.log(`teks: INK/paper ${cx(INK, PAPER).toFixed(2)} | MUTED/paper ${cx(MUTED, PAPER).toFixed(2)} | ACCENT/paper ${cx(ACCENT, PAPER).toFixed(2)} | DEK/paper ${cx(DEK, PAPER).toFixed(2)} | white/ACCENT ${cx("#FFFFFF", ACCENT).toFixed(2)} (target >=4.5:1)`);
gate("[v3] putih di atas chip REPORTED ≥4.5:1", cx("#FFFFFF", "#1F6B3A") >= 4.5, cx("#FFFFFF", "#1F6B3A").toFixed(2) + ":1");
gate("[v3] putih di atas chip FORECAST ≥4.5:1", cx("#FFFFFF", "#1F4E79") >= 4.5, cx("#FFFFFF", "#1F4E79").toFixed(2) + ":1");
gate("putih di atas VERDICT navy ≥4.5:1", cx("#FFFFFF", "#2E3A4A") >= 4.5, cx("#FFFFFF", "#2E3A4A").toFixed(2) + ":1");

// 5. Pixel checks with PIL (rendered coordinates).
writeFileSync("/tmp/verify-v3.py", `
from PIL import Image
import numpy as np
fin = np.asarray(Image.open('entry-final-v3.png').convert('RGB')).astype(float)
def lum(a):
    c = a/255.0
    lin = np.where(c<=0.04045, c/12.92, ((c+0.055)/1.055)**2.4)
    return 0.2126*lin[:,:,0]+0.7152*lin[:,:,1]+0.0722*lin[:,:,2]
def cw(l): return 1.05/(l+0.05)
# Masthead date (rendered y ~57..96, x ~58..966): INK on PAPER.
reg = fin[57:97, 58:966]
L = lum(reg)
Ls = np.sort(L.flatten())
print(f"masthead date region: p5 lum {Ls[int(len(Ls)*0.05)]:.3f} (INK ~0.02) | p95 {Ls[int(len(Ls)*0.95)]:.3f} (PAPER ~0.80)")
# Hero #2 Taipei (rendered x 361..663, y 214..294): batang merah + menara gelap.
hero = fin[214:294, 361:663]
Hl = lum(hero)
print(f"hero #2 Taipei: mean lum {Hl.mean():.3f} | min {Hl.min():.3f} | max {Hl.max():.3f} | std {Hl.std():.3f} (std>0.05 = ada isi, bukan polos)")
# DATE CHECK box (rendered y 932..968): merah ACCENT + teks putih.
dc = fin[932:968, 48:976]
R,G,B = dc[:,:,0], dc[:,:,1], dc[:,:,2]
red = (R>150)&(G<100)&(B<80)
white = (R>230)&(G>230)&(B>230)
print(f"DATE CHECK box: piksel merah {100*red.mean():.1f}% | piksel putih (teks) {100*white.mean():.1f}%")
# VERDICT box (rendered y 601..649, x 364..976): navy + teks putih.
vb = fin[601:649, 364:976]
R2,G2,B2 = vb[:,:,0], vb[:,:,1], vb[:,:,2]
navy = (R2<70)&(G2<90)&(B2<110)
white2 = (R2>230)&(G2>230)&(B2>230)
print(f"VERDICT box: piksel navy {100*navy.mean():.1f}% | piksel putih (teks) {100*white2.mean():.1f}%")
# Tail (rendered baselines 829..920 pitch 13, sel 232px mulai x 48/280/512/744):
# teks tiap sel TIDAK BOLEH menyentuh nomor kolom berikut. Celah minimum 5px.
grays = np.asarray(Image.open('entry-final-v3.png').convert('L')).astype(float)/255
gaps = []
for base in [829,842,855,868,881,894,907,920]:
    band = grays[base-10:base+3, :]
    dark = band < 0.5
    for (x0,x1) in [(48,280),(280,512),(512,744),(744,976)]:
        xs = np.where(dark[:, x0:x1].any(axis=0))[0]
        if len(xs): gaps.append(x1-(x0+xs.max()))
print(f"TAIL GAP min {min(gaps)}px (batas 5px) | gaps {','.join(map(str,gaps))}")
`);
const pyOut = execSync("python3 /tmp/verify-v3.py", { encoding: "utf8" });
console.log(pyOut.trimEnd());
const tailGap = pyOut.match(/TAIL GAP min (\d+)px/);
gate("[v3 eye] celah tail ke nomor kolom berikut ≥5px (piksel nyata)", tailGap ? parseInt(tailGap[1], 10) >= 5 : false, tailGap ? `${tailGap[1]}px` : "tidak terukur");

// 6. Story + continent counts + tail numbering + layout budget (from JSON).
const d = JSON.parse(readFileSync("news-v3.json", "utf8"));
console.log(`stories: heroes ${d.heroes.length} + grid ${d.grid.length} + brief ${d.brief.length} = ${d.heroes.length + d.grid.length + d.brief.length} (target 45, main 13)`);
gate("[v3 V1] total cerita 40-46", d.heroes.length + d.grid.length + d.brief.length >= 40 && d.heroes.length + d.grid.length + d.brief.length <= 46, `${d.heroes.length + d.grid.length + d.brief.length}`);
const tailNums = d.brief.map((b) => b.n);
const tailSeq = tailNums.every((n, i) => n === 14 + i);
gate("[v3 V1] tail bernomor urut 14..45 tanpa bolong", tailSeq && tailNums.length === 32, tailNums.join(","));
const longHeads = d.brief.filter((b) => b.headline.length > 31);
gate("headline tail ≤31 kar (0 truncasi)", longHeads.length === 0, longHeads.length ? longHeads.map((b) => `#${b.n} ${b.headline.length}kar`).join("; ") : "semua ≤31 kar");
const counts = { NA: 0, SA: 0, EU: 0, AF: 0, AS: 0, OC: 0, null: 0, undef: 0 };
const M = { "GAMING": null, "SPACE": null, "CANADA": "NA", "U.S.": "NA", "ALASKA": "NA", "FLORIDA": "NA", "CHINA": "AS", "INDIA": "AS", "JAPAN": "AS", "KOREA": "AS", "GAZA": "AS", "SAUDI ARABIA": "AS", "THE HAGUE": "EU", "BLACK SEA": "EU", "EU": "EU", "FRANCE": "EU", "ITALY": "EU", "SPORT": "EU", "MEXICO": "NA", "LATIN AMERICA": "SA", "AUSTRALIA": "OC", "HORN OF AFRICA": "AF", "LIBYA": "AF", "PAKISTAN": "AS", "INDONESIA": "AS", "OMAN": "AS", "TURKEY": "AS", "EGYPT": "AF", "AFRICA": "AF", "NEW ZEALAND": "OC", "ARGENTINA": "SA", "MALAWI": "AF", "TAIWAN": "AS" };
const all = [...d.heroes, ...d.grid, ...d.brief];
for (const it of all) {
  const hay = ((it.kicker || "") + " " + it.headline).toUpperCase();
  let c = undefined;
  for (const [k, v] of Object.entries(M)) if (hay.includes(k)) { c = v; break; }
  if (c === undefined) counts.undef++; else if (c === null) counts.null++; else counts[c]++;
}
console.log(`continents: NA ${counts.NA} SA ${counts.SA} EU ${counts.EU} AF ${counts.AF} AS ${counts.AS} OC ${counts.OC} off-continent ${counts.null} unmapped ${counts.undef}`);
const barSum = d.regionBar.reduce((n, r) => n + r.count, 0);
gate("region bar jumlah = total - off-continent", barSum === 45 - counts.null && counts.undef === 0, `bar ${barSum}, off ${counts.null}, unmapped ${counts.undef}`);
console.log(`layout v3: OY=-16 | masthead tanggal Didone 54px + dek miring | stat strip 6 kotak 148x48 (angka 26px) | region bar GEOGRAFIS 12px | 3 hero 302x80 (Japan/Taipei/chart) + headline 22px + dek 13px + chip status | grid pitch 57, ilustrasi ADEGAN 48px, headline 14px + chip status | peta band 460x90 (9 pin bernomor + 19 dot abu) + legenda 2 kolom | timeline UTC 6 slot | tail 4 kol x 8 baris, pitch 13, font 12px, 32 brief berlabel tempat | VERDICT navy 612x48 | DATE CHECK box 928x36 2 baris (7 pengecualian bertanggal + "Not yet:") | footer 2 baris | bottom GEN 1018 -> rendered 1002 (margin 22px)`);
console.log(`\n=== VERIFY V3: ${PASS} PASS, ${FAIL} FAIL ===`);
if (FAIL > 0) process.exit(1);
