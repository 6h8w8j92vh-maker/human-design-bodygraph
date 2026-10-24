// Published charts as fixtures: node test/published-charts.js
// Ra Uru Hu: full chart from Jovian Archive. Others: Type as published (Einstein, Oprah: Generator; Obama: Projector),
// birth data from Astro-Databank (AA rating).
const E = require('./engine.js');
const HD = require('../src/core.js');
const FIXTURES = [
  { name: 'Ra Uru Hu', at: [1948, 4, 9, 0, 14, 'America/Toronto'], type: 'Manifestor', authority: 'Splenic', profile: '5/1', cross: '51/57 | 61/62' },
  { name: 'Albert Einstein', at: [1879, 3, 14, 11, 30, 'Europe/Berlin'], type: 'Generator' },
  { name: 'Barack Obama', at: [1961, 8, 4, 19, 24, 'Pacific/Honolulu'], type: 'Projector' },
  { name: 'Oprah Winfrey', at: [1954, 1, 29, 4, 30, 'America/Chicago'], type: 'Generator' },
];
let fail = 0;
for (const f of FIXTURES) {
  const c = HD.chart(E, HD.zonedToUtc(...f.at));
  const got = { type: c.type, authority: c.authority, profile: c.profile, cross: c.cross.gates };
  for (const k of ['type', 'authority', 'profile', 'cross']) {
    if (f[k] && f[k] !== got[k]) { fail++; console.log('FAIL', f.name, k, 'expected', f[k], 'got', got[k]); }
  }
}
console.log(fail ? fail + ' mismatches' : 'all ' + FIXTURES.length + ' published charts match');
process.exit(fail ? 1 : 0);
