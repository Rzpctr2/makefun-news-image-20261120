# STATUS — news-image-20261120 (v1 BUILD SELESAI, BELUM SUBMIT)

**Bounty:** news-image-20261120 — dibuka 20 Nov 07:00 WIB (00:00 UTC).
Deadline **22 Nov 2026 00:00 UTC (22 Nov 07:00 WIB)**, $250, top 50 paid (1st $50).
**Kuota (dicek kickoff 20 Nov 07:10 WIB):** entries_made 0, day cap left 3/3,
hard limit left 20/20, can_submit true. **Verifikasi ulang kuota saat submit.**

## v1 — BUILD SELESAI 20 Nov 00:54 WIB (agen build 52c572c1)

- **File:** `entry-final-v1.png` — **251.373 B** (245,5 KiB; cap 307.200 B, headroom 55.827 B),
  sha256 `526980da69422612b615e5d02e87619e23060340acb656e329cc853c16f40900`.
  `entry-final-v1.svg` sha `a1fab995…` (hanya di entries dir — JANGAN masuk repo).
- **Cerita: 33** (3 hero + 10 grid + 20 brief) — 3+10+20 dari awal, TIDAK ada yang dipotong.
  Benua: NA 7 · SA 1 · EU 7 · AF 1 · AS 12 · OC 4 · off-continent 1 (USSF-317) · unmapped 0.
- **Lead #1:** Japan core CPI +2.2% (Reuters, 20 Nov) — BOJ Dec hike to 1.5% expected.
  Hero #2 Florida floods / Kyle (NWS, art vaporwave v15). Hero #3 China LPR (Reuters).
- **Perangkat:** chip status CONFIRMED di 3/3 hero + sumber; HOW SURE legend; DATE CHECK
  box (pengecualian 19 Nov bernama: Shenzhen summit, ICJ ruling, Anthropic debut,
  Rose pardon) + "Not yet: MAMA Chapter 2 — BIGBANG return, Sat 21 Nov; NROL-136
  12:30 UTC"; timeline UTC 6 slot ("~" untuk perkiraan); stat strip 6 angka;
  region bar; peta 9 pin bernomor + 12 dot abu + legenda; "Original drawings".
- **Generator:** `generate-v1.mjs` (dari v8 19 Nov + port ekor v26: 4 kol x 5 baris,
  pitch 14, font 12px, headline ≤31 kar; hero #1 digambar ulang bendera Jepang +
  batang CPI; 5 ilustrasi grid baru: roket, kerumunan, globe, panggung, kriket;
  post-step PIL RGB + zlib level 9; offset label timeline +6 → +12 setelah cek mata).
- **Verifier `verify-v1.mjs`: SEMUA GATE PASS** (35 PASS, 0 FAIL, di-run ulang penuh
  setelah perbaikan timeline): determinisme 2× byte-identik (a==b==entry-v1),
  ukuran 251.373 B ≤1 MiB, truncasi 0, overlap 0, kontras ≥4,5:1
  (INK 12,83 / MUTED 5,57 / ACCENT 4,87 / putih-aksen 5,91), pin 9/9 utuh,
  dot abu 20, grid pitch 58, timeline 6 slot, DATE CHECK + "Not yet:", footer 8/8 sumber.
- **Cek mata:** skala penuh + 300px — terbaca; satu cacat ditemukan & diperbaiki
  ("EVENINGCOP31 closes" menempel → offset label +12, label slot 12:00 dipendekkan).
- **main.ts:** disiapkan (copy `entry-final-v1.png` → /output/entry.png),
  diverifikasi 2× byte-identik (sha sama dengan entry-final-v1.png).
  `README-submit.md`: template resmi (3 badge live + Run it + referral svpns4t9).
  **Repo BELUM dibuat, BELUM push, BELUM submit — butuh approval eksplisit Gibran.**

## Yang terverifikasi ulang saat build (20 Nov ~00:35–00:50 UTC)

- Japan CPI +2.2% (Reuters, dateline TOKYO Nov 20; core-core 2.2%; 86% ekonom
  perkirakan hike ke 1,50% 17–18 Des) — TERKONFIRMASI.
- Akvan: landfall ~noon IST 20 Nov dekat Gopalpur, 90–100 km/jam gusting 110
  (IMD); evakuasi 100.000+ (angka 105.304 vs 46.700 bertentangan antar sumber —
  dipakai "100K+" yang aman).
- COP31: tutup 20 Nov; draf cover decision 19 Nov dipangkas 144→80 paragraf,
  bahasa fossil fuel dihapus; adaptasi $120bn/thn 2035 vs kebutuhan $305bn/thn.
- UK–EU summit: bertemu 20 Nov, Brussels (Burnham + von der Leyen + Costa);
  paket SPS ~£5,1bn/thn, ETS ~£3,8bn/thn, youth scheme; GDP +0,4% ≈ £17bn
  (proyeksi pemerintah — dicatat di footer2).
- Youth strike: 300+ sekolah UK (klaim organisator; dipakai "300+"), 34 kota
  Jerman, mogok umum CGIL Italia.
- Florida: banjir berlanjut 20 Nov; flood watch sampai Jumat malam (NWS);
  St. Johns lampaui rekor 1953 pada 19 Nov (konteks, bukan headline);
  NHC: low Bahamas 60% jadi Kyle dalam 7 hari.
- India v NZ Day 2 LIVE: NZ 273/5, Nicholls 124, Phillips 109 (Day 2 berjalan).
- MAMA Ch.2 21 Nov 15:00 JST (BIGBANG full-group return) + NROL-136 21 Nov
  12:30 UTC — TERKONFIRMASI untuk baris "Not yet".
- USSF-317 04:32 UTC 20 Nov; Long March 8A 11:59 UTC 20 Nov (6C 03:50 UTC
  21 Nov — DIKECUALIKAN dari cerita 20 Nov).

## Masih terjadwal saat build (dibingkai jujur, BUKAN sebagai hasil)

- China LPR: hasil BELUM keluar saat build (00:50 UTC; putusan 01:15 GMT) —
  hero #3 "set to hold" per survei Reuters (23/28). Bila Gibran mau, hasil LPR
  bisa dimasukkan sebelum submit (ganti headline jadi "China holds rates…").
- Akvan landfall (~06:30 UTC), COP31 close, UK–EU outcome, youth-strike
  turnout, USSF-317 (04:32 UTC), Huawei OSTA (06:30 UTC), MAMA Ch.1 (09:00 UTC),
  US retail sales + Michigan sentiment, Anthropic close, LA port deadline —
  semua "due today / closes today / to hold", bukan hasil.
- Argentina Sovereignty Day + Oman National Day = observance tahunan 20 Nov
  (bukan berita breaking) — dipakai sebagai brief, bukan hero/grid utama.
- Iran war cost $48.3bn (testimoni Pentagon 19 Nov, baru dilaporkan 20 Nov)
  DIKECUALIKAN (pola sama seperti Nvidia 19 Nov). California AG–Nvidia
  DIKECUALIKAN (19 Nov). UK GfK confidence TIDAK dipakai (angka tak terkonfirmasi).

## Yang BELUM (butuh Gibran / agen submit)

- [ ] Approval Gibran untuk submit v1 (atau minta revisi dulu).
- [ ] Verifikasi kuota ulang saat submit (day cap reset 07:00 WIB).
- [ ] Repo GitHub baru `Rzpctr2/makefun-news-image-20261120` (public, dibuat SETELAH
      bounty buka, OSI license) + `main.ts` + `generate-v1.mjs` + `verify-v1.mjs` +
      `news-v1.json` + `entry-final-v1.png` + `README-submit.md` (sebagai README.md)
      + LICENSE + STATUS.md — SVG JANGAN masuk repo.
- [ ] About repo via web UI (website bounty, topic `makefun`, deskripsi ≤245 kar).
- [ ] Bundle sesi build + `makefun check` hijau (ok:true) SEBELUM submit, lalu submit.
- [ ] Catat submission ID + claim code → cek status/rank.
