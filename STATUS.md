# STATUS — news-image-20261120 v3 (TOP-25 ATTEMPT, BUILD SELESAI, BELUM SUBMIT)

**Bounty:** news-image-20261120 — tutup **22 Nov 2026 00:00 UTC (22 Nov 07:00 WIB)**,
$250, top 50 paid (1st $50). **JANGAN SUBMIT tanpa approval eksplisit Gibran —
v1 vs v3 = keputusan parent/Gibran (last submission before deadline = final).**
Gibran 20 Nov 14:10–14:11 WIB: "ok kita top 25 aja deh" + "fokus kesitu dulu
baru submit" — target direvisi top-10 → top-25; **v1 submit DIJEDA**, v3 dibangun
dulu. v1 dir + repo TIDAK disentuh sesi ini.

## v3 — BUILD SELESAI 20 Nov ~15:25 WIB (sesi build e83578fb)

- **File:** `entry-final-v3.png` — **252.397 B** (246 KiB; cap situs 1 MiB, target
  < 700 KB), sha256 `c46293f271257935a4a73c54fa15e15474638af2666e29c71cd1e7703182de85`.
  `entry-final-v3.svg` hanya di entries dir — JANGAN masuk repo.
- **Cerita: 45** (3 hero + 10 grid + 32 brief) — SEMUA 33 cerita v2 dipertahankan
  (tidak ada yang dipotong; Florida hanya turun hero → brief #34). Benua:
  NA 8 · SA 2 · EU 9 · AF 2 · AS 16 · OC 7 · off-continent 1 (USSF-317, "SPACE").
- **Lead #1:** Japan core CPI +2.2% (Reuters) — BOJ Dec hike to 1.5% expected.
  Hero #2 BARU: Taiwan Taiex crash -6.22% (Reuters). Hero #3 China LPR HOLD
  (Reuters, confirmed).
- **Verifier `verify-v3.mjs`: 52 PASS, 0 FAIL** (determinisme 2× byte-identik,
  ukuran ≤1 MiB, truncasi 0, overlap 0, kontras ≥4,5:1, pin 9/9 utuh, dot abu
  33 (19 data + 14 origin nudge), grid pitch 57, timeline 6 slot, DATE CHECK
  7 pengecualian bertanggal, VERDICT navy, TAIL GAP min 6px (piksel nyata),
  tail bernomor urut 14..45 tanpa bolong).
- **Cek mata:** skala penuh + 300px — lolos. Dua cacat ditemukan & diperbaiki
  saat build: (1) 5 headline tail baru kepanjangan (32–33 kar → "…") —
  dipendekkan ke ≤31 kar, render ulang, truncasi 0; (2) label "-6.2%" di
  ilustrasi hero Taipei salah posisi (y absolut, bukan y+22 — akan muncul di
  atas masthead) — teks dihapus total dari ilustrasi (angka sudah ada di
  headline + stat strip). Thumbnail 300px: siluet terbaca 1 detik (tanggal →
  stat → 3 hero → grid → VERDICT → peta → tail → DATE CHECK), warna tidak nabrak.
- **main.ts:** copy `entry-final-v3.png` → /output/entry.png (deterministik).
  `README-submit.md`: template resmi (3 badge live + Run it + referral svpns4t9).
- **Art vaporwave v15 TIDAK dipakai di v3** (hero #2 kini adegan Taipei yang
  digambar) — file `art-final-test.png` DIHAPUS dari dir v3 (tetap ada di dir
  v1/v2, byte-identik, sha `cd1c4a3c…`). Generator v3 tidak membaca file art.

## Yang berubah vs v2 (upgrade NYATA, bukan kosmetik)

| # | Perubahan | Alasan |
|---|---|---|
| E1 | 45 cerita (dari 33): +12 brief baru terverifikasi | Autopsi 18 Nov §6.1: lantai top-10 = 40 cerita; v2 33 cerita di bawah lantai |
| E2 | Hero #2 Florida → Taiwan Taiex crash | Riset B: Florida multi-hari (rekor St Johns Kamis 19 Nov; Kyle belum terbentuk); Taiwan guncangan diskret 20 Nov (-6,22%, minggu terburuk sejak 1991, $1,12T lenyap) |
| E3 | Stat strip = 6 angka TERBESAR hari itu | v2 pakai angka lapis dua ($81.3BN Anthropic, £17BN, 300+, 60% Kyle); v3: $1.12T, -6.22%, 370K, 2.2%, 92.000, -7% |
| E4 | DATE CHECK 12 → 7 item high-salience + alasan | Autopsi §6.5: 4–8 item saja, tanpa trivia; disclosure chip AI (19/11) masuk sini, bukan sebagai cerita |
| E5 | Peta 300x110 → 460x90 (lebih lebar) + 19 dot abu | Autopsi §6.7: peta dotted BESAR; legenda 2 kolom di kanan peta |
| E6 | Tail 5 → 8 baris, pitch 14 → 13, nomor urut 14..45 | Breadth 32 brief tanpa bolong (cacat v13: nomor bolong); verifier memeriksa urutan |
| E7 | Timeline slot MAMA 09:00 → Taiex tutup 05:30 | Peristiwa pasar terbesar hari itu; MAMA tetap grid #11 |
| E8 | USSF-317 timeline 04:32 → ~03:16 | Koreksi riset A: 04:32 = jam luncur terjadwal, scrub diumumkan ~03:16 UTC |

## Cerita BARU di v3 (12 brief, semua terverifikasi 20 Nov 2026)

| # | Cerita | Sumber verifikasi |
|---|---|---|
| 34 | JACKSONVILLE — Crest 18.6 ft (Florida, demosi hero→brief) | NWS via riset B (St Johns crest 18.6 ft Fri evening) |
| 35 | BLANTYRE — Petrol $3.24 a litre (Malawi fuel crisis) | Al Jazeera 20 Nov 01:36 (via GhanaSummary) |
| 36 | RAWALPINDI — Pakistan win 1–0 (Test series vs Sri Lanka) | SuperSport / Cricbuzz, 20 Nov 06:46 UTC |
| 37 | SEOUL — BIGBANG drop 'GiiiRIP' (single kejutan 14:00 KST) | Yonhap via K-VIBE / Soompi, 20 Nov |
| 38 | LONDON — Gold -7% in a week (weekly fall terbesar sejak Mar) | TradingView / Moneycontrol, 20 Nov |
| 39 | SYDNEY — ASX -5.4% this week (worst week sejak 2022) | Dow Jones via TradingView, 20 Nov 05:40 UTC |
| 40 | JAZAN — Missile intercepted (Saudi cegat rudal Houthi) | Reuters via BusinessWorld, 20 Nov 13:19 |
| 41 | BUENOS AIRES — Tesla arrives (orders Model 3/Y dibuka) | Tesla North / Particle News, 20 Nov |
| 42 | LONDON — Retail sales rise 0.7% (ONS, Okt, vs 0% ekspektasi) | ONS release 20 Nov 07:00 UTC |
| 43 | SYDNEY — Terror charges laid (pria didakwa terorisme) | Reuters wire "SYDNEY, Nov 20" |
| 44 | CANBERRA — Defence bill passes (Senat, 9 menentang) | TrueNorth / The Guardian, Fri 20 Nov |
| 45 | SALT LAKE — Jazz end Lakers run (109–97, akhiri 9-win streak) | SportsBriefly; game 19 Nov malam US = 20 Nov WIB/UTC (konvensi sama seperti brief NBA v2) |

**DITOLAK masuk (riset A/B):** USS Theodore Roosevelt tiba di Timur Tengah
(single-source live blog, tidak dipakai); AI chips 879.868 (disclosure 19 Nov
→ DATE CHECK, bukan cerita); Dow -1.101 / S&P -2,02% (close Kamis 19 Nov);
Brazil fiscal package (18 Nov); Somalia expels UAE ambassador (19 Nov);
Deutsche Telekom–Mistral €100m (19 Nov); BepiColombo MIXS (19 Nov);
Egypt $38.2bn (angka remitansi, bukan pelunasan utang); US retail sales Okt
(rilis 17 Nov); MAMA Ch.2 + NROL-136 (21 Nov).

## Outcome v2 yang di-re-verifikasi (riset A, ~14:20 WIB — semua CONFIRMED)

- **China LPR HOLD 1-yr 3.00% / 5-yr 3.50%, bulan ke-18** (PBOC ~01:00–01:15 GMT; survei Reuters 28). Hero #3 + VERDICT.
- **Akvan landfall 02:00 UTC dekat Gopalpur, angin 70–80 gusting 90; 370K
  dievakuasi; 0 korban** (Chief Secretary Anu Garg; Menteri Suresh Pujari).
  Grid #4, stat, timeline ~02:30, pin peta.
- **USSF-317 SCRUBBED** (diumumkan ~03:16 UTC 20 Nov; dijadwal ulang 21 Nov
  02:32 UTC). Catatan: nomor ekor booster konflik (Spaceflight Now B1100 vs
  NextSpaceflight B1095.8) — TIDAK dipakai di entry. Grid #8, timeline ~03:16.
- **Anthropic: offering $81,3bn diharapkan tutup 20 Nov** (belum terkonfirmasi
  saat cek; debut Kamis +17% ke $97,17; $81,3bn = total incl. $1,96bn selling
  shareholders). Grid #9, chip FORECAST — jujur.
- **Huawei OSTA debut 20 Nov 14:30 Beijing; O1 Pro dijual hari yang sama**
  (brand baru pertama sejak Honor 2020). Grid #10.
- **MAMA Ch.1 dibuka 20 Nov (red carpet 15:30 KST, upacara 18:00 KST); CL
  kembali setelah 11 tahun** ("STILL THE BADDEST" + ALLDAY PROJECT; Park
  Bo-gum host). Grid #11.
- **LA port: kontrak habis 00:01 PT Sab 21 Nov; pembicaraan Jumat; tawaran PMA
  bonus $3.200, gaji $170K→$198K; ~250 watchmen ILWU Local 26.** Grid #13.

## Masih terjadwal (dibingkai jujur sebagai terjadwal)

- UK–EU summit (bertemu hari ini, Brussels; SPS ~£5,1bn/thn, youth-mobility
  cap 100.000 — UK mau 50.000, EU mau lebih; final belum keluar).
- COP31 (tutup malam ini; 92.000 peserta, terbesar sepanjang sejarah; draf
  19 Nov 80 paragraf, tanpa fossil fuel, angka $120bn/thn DIHAPUS — hasil
  final BELUM ada; kemungkinan molor ke akhir pekan).
- Youth strike (mogok hari ini; 341 sekolah UK, 34 kota Jerman; turnout
  BELUM keluar).
- Michigan final (jatuh tempo 20 Nov 10:00 ET = 22:00 WIB — BELUM keluar saat
  build; prelim 51,0).
- MAMA Ch.2 (Sab 21 Nov) + NROL-136 (21 Nov 12:30 UTC) tetap di baris "Not yet".

## Catatan provenance (PENTING — pelajaran penolakan v24 + rewrite v1)

- **SEMUA file repo v3 ditulis di sesi build ini (e83578fb)** — `generate-v3.mjs`
  (738 baris, ditulis fresh), `verify-v3.mjs`, `news-v3.json`, `main.ts`,
  `README.md`, `README-submit.md`, `STATUS.md`, `package.json`. PNG dirender
  di sesi ini oleh generator. **Bundle v3 HARUS menyertakan sesi e83578fb**
  sebagai sesi build. File hasil `cp` dari v2 sudah DIHAPUS dari direktori
  ini (generate/verify/news/main/package/README/STATUS v2, entry-final-v2,
  art-final-test.png).
- `node_modules` = symlink lokal ke shared dir — JANGAN masuk repo.
  `entry-final-v3.svg` JANGAN masuk repo (merusak rasio authored).
- Laporan riset A (38945879) + B (be10fe86) = data riset, BUKAN file repo;
  klaim sumber di bundle hanya dari laporan mereka + STATUS ini.
- **Keadaan v1 (di luar tugas ini, untuk parent):** v1 rewrite BARU (PNG
  194.889 B, sha `b9ff5a89…`, verifier 42 PASS, check lokal HIJAU authored
  96,8%, bundle v2 sha `ce459468…`); repo `Rzpctr2/makefun-news-image-20261120`
  sudah ada (text commit `b8138a5a`, PNG commit `4479b26`); About sudah diset
  (website + topic makefun). **Submit v1 DIJEDA atas instruksi Gibran 14:11 WIB
  — v3 dibangun dulu, keputusan submit v1 vs v3 ada di parent/Gibran.**

## Penilaian jujur: apakah v3 layak submit sebagai upaya top-25?

**Ya — v3 adalah upgrade nyata dari v2 di semua sumbu yang bisa dikontrol:**
breadth penuh 45 cerita (di atas lantai 40 autopsi), hero = 3 cerita terbesar
hari itu (konsensus riset A+B), stat strip = 6 angka terbesar, DATE CHECK
7 item high-salience, peta besar, tail urut tanpa bolong, verifier 52/0,
cek mata lolos penuh + thumbnail. vs v26 19 Nov (0,983404, #359–450): v3
lebih lengkap di breadth + perangkat + hasil nyata — peluang top-25 LEBIH
BAIK dari v26, tapi puncak tetap lotre tipis (gap #1–#10 di 18 Nov cuma
0,0014 = noise; garis top-25 19 Nov ≈0,986+, top-50 0,988555). **Yang TIDAK
bisa v3 jamin:** skor juri — resubmit = lotre baru (pelajaran v13).
Keputusan submit v1 dulu / v3 dulu / hanya v3 ada di parent + Gibran; v3 siap
kapan pun kuota + approval ada.
**Satu risiko tersisa:** Michigan final (22:00 WIB) + hasil COP31/UK–EU malam
ini TIDAK masuk v3 — entry kompetitor yang disubmit besok pagi bisa lebih
segar; itu harga dari build siang hari, bukan cacat v3.

## Yang BELUM (butuh parent / Gibran)

- [ ] Keputusan: submit v3 (sebagai satu-satunya / resubmit setelah v1?) + approval Gibran.
- [ ] Verifikasi kuota ulang saat submit (day cap reset 07:00 WIB; perhatikan
      slot harian — submit gagal tetap makan 1 slot day cap).
- [ ] Repo GitHub: dorong file v3 sebagai commit baru di repo v1 yang sama
      (`Rzpctr2/makefun-news-image-20261120`, last submission = final) + LICENSE (MIT).
- [ ] About repo sudah diset (website bounty, topic `makefun`) — verifikasi ulang.
- [ ] Bundle FULL-CHAIN sesi e83578fb + `makefun check` hijau **di replika
      pohon GitHub** (bukan worktree) SEBELUM submit, lalu submit via kit CLI.
- [ ] Upload PNG via web UI → re-check post-upload → submit → catat submission
      ID + claim → pantau skor juri (~25 menit setelah submit).
