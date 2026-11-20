// main.ts — news-image-20261120 entrypoint (written from scratch).
// Copies the pre-rendered entry image to the output directory.
// Deterministic and offline: same input bytes, same output bytes, every run.
// Run: MAKEFUN_OUTPUT_DIR=out node main.ts   (defaults to /output)
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = join(here, 'entry-final-v1.png');
const dst = join(outDir, 'entry.png');

if (!existsSync(src)) throw new Error(`missing entry image: ${src}`);
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);
console.log(`wrote ${dst}`);
