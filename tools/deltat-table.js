// Builds tools/data/deltat.json: Delta T per year (seconds, 1 July), 1700-2201, from Swiss Ephemeris.
// Run once from a folder with the sweph package: node deltat-table.js <folder with .se1 files> > data/deltat.json
const Sw = require('sweph'); Sw.set_ephe_path(process.argv[2]);
const first = 1700, last = 2201, v = [];
for (let y = first; y <= last; y++) v.push(+(Sw.deltat(Sw.julday(y, 7, 1, 0, 1)) * 86400).toFixed(3));
console.log(JSON.stringify({ first, values: v }));
