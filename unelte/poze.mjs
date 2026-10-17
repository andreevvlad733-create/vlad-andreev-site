// Rulat de GitHub după fiecare urcare în img/ (vezi .github/workflows/poze.yml).
// 1. Pozele mai mari de 2400 px pe latura lungă se micșorează pe loc, ca site-ul să rămână rapid.
// 2. Fiecare poză primește în img-mic/ o copie de 800 px, folosită în grile și pe copertele albumelor.
// 3. Copiile mici rămase fără original se șterg.
import sharp from 'sharp';
import { readdir, mkdir, rm, stat, rename } from 'node:fs/promises';
import { join } from 'node:path';

const radacina = process.argv[2] || '.';
const IMG = join(radacina, 'img'), MIC = join(radacina, 'img-mic');
const MAX = 2400, LATIME_MIC = 800;
const ePoza = f => /\.(jpe?g|png|webp)$/i.test(f);
const ajusteaza = (s, f) => /\.png$/i.test(f) ? s.png({ compressionLevel: 9 }) : /\.webp$/i.test(f) ? s.webp({ quality: 82 }) : s.jpeg({ quality: 82, mozjpeg: true });

await mkdir(MIC, { recursive: true });
const poze = (await readdir(IMG)).filter(ePoza);
let mari = 0, noi = 0, sterse = 0;

for (const f of poze) {
  const sursa = join(IMG, f), mica = join(MIC, f);
  const { width, height } = await sharp(sursa).metadata();
  if (Math.max(width, height) > MAX) {
    const tmp = sursa + '.tmp';
    await ajusteaza(sharp(sursa).rotate().resize(MAX, MAX, { fit: 'inside' }), f).toFile(tmp);
    await rename(tmp, sursa);
    mari++;
  }
  const s1 = await stat(sursa), s2 = await stat(mica).catch(() => null);
  if (!s2 || s2.mtimeMs < s1.mtimeMs) {
    await ajusteaza(sharp(sursa).rotate().resize(LATIME_MIC, null, { withoutEnlargement: true }), f).toFile(mica);
    noi++;
  }
}
for (const f of await readdir(MIC)) if (!poze.includes(f)) { await rm(join(MIC, f)); sterse++; }
console.log(`Poze: ${poze.length}. Micșorate: ${mari}. Copii mici noi: ${noi}. Copii mici șterse: ${sterse}.`);
