# The World in One Day — Friday 20 November 2026

[![make.fun bounty](https://img.shields.io/badge/make.fun-news--image--20261120-7c3aed)](https://make.fun/bounty/news-image-20261120)
[![rank](https://img.shields.io/badge/rank-pending-lightgrey)](https://make.fun/bounty/news-image-20261120)
[![prize](https://img.shields.io/badge/prize-%2450%20for%201st-green)](https://make.fun/bounty/news-image-20261120)

One image summing up the world's news of **Friday 20 November 2026** — 33
verified stories across six continents, drawn as a one-page newspaper front
page: a giant Didone masthead date, three lead stories, ten illustrated
stories, twenty briefs, a world map with numbered pins, a UTC timeline, a
stat strip, and a DATE CHECK box that names what was deliberately left out
(19 Nov news) and what had not happened yet (21 Nov events).

Entry for the [make.fun](https://make.fun) bounty
[`news-image-20261120`](https://make.fun/bounty/news-image-20261120)
($250 pot, top 50 paid, 1st $50). Referral code: **`svpns4t9`**.

## Run it

```sh
npm install
npm run render   # node generate-v1.mjs news-v1.json entry-final-v1.png entry-v1.svg
npm run verify   # node verify-v1.mjs — every gate must PASS
MAKEFUN_OUTPUT_DIR=out node main.ts   # copies entry-final-v1.png to out/entry.png
```

`main.ts` is the entrypoint: it copies `entry-final-v1.png` to
`$MAKEFUN_OUTPUT_DIR/entry.png` (default `/output`). Deterministic and
offline — two runs write byte-identical files.

`generate-v1.mjs` renders the poster from `news-v1.json` (SVG via
`@resvg/resvg-js`, then a hand-rolled RGB PNG encoder, zlib level 9).
`verify-v1.mjs` checks determinism (two runs byte-identical), size
(≤ 307,200 B), PNG integrity, zero truncation, 33 stories, 9 map pins,
6 timeline slots, the DATE CHECK + "Not yet:" lines, footer sources, and
text contrast ≥ 4.5:1.

## The 33 stories

**Leads** — 1. Japan CPI +2.2%; Dec BOJ hike expected (CONFIRMED · REUTERS) ·
2. Florida floods on; Kyle may form off Bahamas (CONFIRMED · NWS) ·
3. China set to hold rates for 18th month (CONFIRMED · REUTERS)

**More from the day** — 4. Akvan due ashore near Gopalpur · 5. UK–EU summit
meets in Brussels · 6. COP31 closes today in Antalya · 7. Students walk out
across Europe · 8. SpaceX due to launch USSF-317 · 9. Anthropic offer due to
close · 10. Huawei debuts OSTA phone brand · 11. MAMA Awards open in Osaka ·
12. Nicholls, Phillips tons lift NZ · 13. LA port watchmen face deadline

**Also on Friday 20 November** — 14. Pakistan petrol rises to Rs323 ·
15. India dedicates H5N1 vaccine · 16. Cancer-on-a-chip study in PNAS ·
17. Hyundai Neira EV debuts today · 18. Grizzlies visit Warriors in NBA ·
19. F1: Vegas qualifying tonight · 20. Bayern host Köln in Bundesliga ·
21. Athletic v Espanyol in La Liga · 22. Alcaraz v Cobolli at ATP Finals ·
23. Hunger Games prequel in cinemas · 24. Gold found in Egyptian tomb ·
25. Oman marks National Day today · 26. OpenAI gateway rule in effect ·
27. Senate takes up French budget · 28. Robbie Williams plays Brisbane ·
29. Trans Day marked across NZ · 30. Storms loom over east Australia ·
31. Argentina marks Sovereignty Day · 32. Long March 8A to launch SatNet ·
33. IFFI opens in Goa; 150+ films

**DATE CHECK** — All stories above are 20 Nov. Left out: Shenzhen summit,
ICJ ruling, Anthropic debut, Rose pardon. **Not yet:** MAMA Chapter 2 —
BIGBANG's full-group return, Sat 21 Nov, Osaka; NROL-136 launches 12:30 UTC.

Sources: Reuters · AP · AFP · BBC · The Hindu · IMD · Bloomberg · NWS · NHC.
All illustrations are original drawings.

## License

MIT
