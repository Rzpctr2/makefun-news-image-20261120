# The World in One Day — Friday 20 November 2026 (v3)

A one-page illustrated front page of 20 November 2026: 45 stories from six
continents (3 heroes + 10 grid + 32 briefs), drawn entirely as code (SVG) so
every headline is sharp and spelled correctly.

v3 is a top-25 attempt (Gibran, 20 Nov 14:10–14:11 WIB: "ok kita top 25 aja
deh" + "fokus kesitu dulu baru submit" — target revised from top-10, v1
submit paused). vs v2 it adds 12 verified stories (45 total — the 18 Nov
winners autopsy puts the top-10 floor at 40 stories), swaps hero #2 to the
day's biggest shock (Taiwan's Taiex crashing 6.22%, worst week since 1991),
rebuilds the stat strip from the 6 biggest numbers of the day, trims DATE
CHECK to 7 high-salience dated exclusions, widens the dotted map to 460px,
and numbers the tail sequentially 14–45 with no gaps. All 33 v2 stories are
kept — nothing was cut (the v13 lesson); Florida only moves hero → brief.

## Files

- `news-v3.json` — the 45 verified stories + all page data
- `generate-v3.mjs` — renders the front page (Node + @resvg/resvg-js)
- `verify-v3.mjs` — 52 gates: determinism, byte cap, layout, contrast, pixel checks
- `entry-final-v3.png` — the finished page, 1024×1024, 252,397 B
- `main.ts` — entrypoint: copies `entry-final-v3.png` to `/output/entry.png`

## Render / verify

```sh
npm run render   # node generate-v3.mjs news-v3.json entry-final-v3.png entry-final-v3.svg
npm run verify   # node verify-v3.mjs  → 52 PASS, 0 FAIL
```

Deterministic: two renders are byte-identical. PNG is RGB + zlib level 9
(lossless), under the 1 MiB site cap (target < 700 KB).

## License

MIT
