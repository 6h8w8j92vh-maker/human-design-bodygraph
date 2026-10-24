// Builds tools/data/outer.json: Chebyshev fits of heliocentric, geometric, J2000-ecliptic positions (AU)
// for Jupiter to Pluto, 1800-2200, from NASA JPL DE431 as stored in the Swiss Ephemeris files (sepl_18.se1).
// Run once from a folder with the sweph package: node fit-outer.js <folder with .se1 files> <out.json>
const fs = require('fs'); const Sw = require('sweph');
const [ , , sedata, outFile] = process.argv; Sw.set_ephe_path(sedata);
const FLAGS = 2 | 8 | 16 | 32 | 64 | 512 | 1024 | 4096;
const BODY = { jupiter: 5, saturn: 6, uranus: 7, neptune: 8, pluto: 9 };
const START = 2378496.5, END = 2524593.5;   // 1800-01-01 .. 2200-01-01 (TT)
const pos = (jd, id) => { const r = Sw.calc(jd, id, FLAGS); if (!(r.flag & 2)) throw new Error('need full SE files: ' + r.error); return r.data.slice(0, 3); };
function fitSeg(id, a, b, n) {
  const N = n + 1, c = [[], [], []], f = [];
  for (let k = 0; k < N; k++) { const x = Math.cos(Math.PI * (k + 0.5) / N); f.push([x, pos((a + b) / 2 + x * (b - a) / 2, id)]); }
  for (let j = 0; j < N; j++) for (let ax = 0; ax < 3; ax++) {
    let s = 0; for (const [x, p] of f) s += p[ax] * Math.cos(j * Math.acos(x));
    c[ax][j] = (j === 0 ? 1 : 2) * s / N;
  }
  return c;
}
const cheb = (c, x) => { let b0 = 0, b1 = 0, b2; for (let j = c.length - 1; j >= 1; j--) { b2 = b1; b1 = b0; b0 = 2 * x * b1 - b2 + c[j]; } return x * b0 - b1 + c[0]; };
const UNIT = 1e-9;   // coefficients stored as integers in units of 1e-9 AU
const round = (v) => Math.round(v / UNIT) * UNIT;
const out = { source: 'NASA JPL DE431 (via Swiss Ephemeris files), heliocentric geometric J2000 ecliptic, AU, TT', start: START, end: END, bodies: {} };
for (const [name, id] of Object.entries(BODY)) {
  const dist = { jupiter: 4, saturn: 8, uranus: 17, neptune: 28, pluto: 28 }[name];
  const target = 0.02 / 206265 * dist;   // 0.02" seen from Earth at closest approach
  let best = null;
  for (const len of [182.625, 365.25, 730.5, 1461, 2922, 5844]) {
    for (let n = 6; n <= 32; n++) {
      // test one segment in the middle with random points
      const a = 2451545 - len / 2, b = a + len, c = fitSeg(id, a, b, n).map((ax) => ax.map(round));
      let err = 0;
      for (let i = 0; i < 40; i++) { const t = a + Math.random() * len, x = (2 * t - a - b) / (b - a), p = pos(t, id); err = Math.max(err, Math.hypot(...[0, 1, 2].map((k) => cheb(c[k], x) - p[k]))); }
      if (err < target / 3) { const cost = Math.ceil((END - START) / len) * (n + 1) * 3; if (!best || cost < best.cost) best = { len, n, cost }; break; }
    }
  }
  const segs = [];
  for (let a = START; a < END; a += best.len) segs.push(fitSeg(id, a, a + best.len, best.n).map((ax) => ax.map(round)));
  out.bodies[name] = { len: best.len, n: best.n, segs };
  // full check over the whole span
  let err = 0;
  for (let i = 0; i < 3000; i++) {
    const t = START + Math.random() * (END - START), k = Math.floor((t - START) / best.len), a = START + k * best.len, x = (2 * t - 2 * a - best.len) / best.len, p = pos(t, id);
    err = Math.max(err, Math.hypot(...[0, 1, 2].map((j) => cheb(segs[k][j], x) - p[j])));
  }
  console.log(name.padEnd(8), 'segment', best.len, 'days, degree', best.n, ', numbers', best.cost, ', max error', (err / dist * 206265).toFixed(4) + '" at ' + dist + ' AU');
}
for (const b of Object.values(out.bodies)) b.segs = b.segs.map((s) => s.map((ax) => ax.map((v) => Math.round(v / UNIT))));
out.unit = UNIT;
const txt = JSON.stringify(out); fs.writeFileSync(outFile, txt); console.log('size', (txt.length / 1024).toFixed(0), 'KB');
