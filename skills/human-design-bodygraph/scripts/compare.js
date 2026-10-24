#!/usr/bin/env node
// How two charts connect, channel by channel, using Jovian Archive's four kinds of connection:
//   electromagnetic: each person has one gate of the channel (attraction, and sometimes friction)
//   companionship:   both have the whole channel (easy friendship in that area)
//   dominance:       one has the whole channel, the other has neither gate (one leads, the other follows there)
//   compromise:      one has the whole channel, the other has one of its gates (the one with the single gate gives way)
// Usage: node compare.js --a "1988-03-21 08:15 Europe/Amsterdam" --b "1990-07-02 14:30 America/New_York" [--json]
const { HD, HDRead, EPH, birthArgs, fail } = require('./load.js');

const argv = process.argv.slice(2);
const get = (k) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : undefined; };
const parse = (label) => {
  const v = get(label);
  if (!v) fail('give --' + label + ' "YYYY-MM-DD HH:MM Area/City" (or "YYYY-MM-DD HH:MM lat,lon")');
  const [date, time, where] = v.trim().split(/\s+/);
  if (!where) fail('--' + label + ' needs a date, a time and a time zone or lat,lon');
  const m = where.match(/^(-?[\d.]+),(-?[\d.]+)$/);
  const args = ['--date', date, '--time', time, ...(m ? ['--lat', m[1], '--lon', m[2]] : ['--tz', where])];
  return HD.chart(EPH, birthArgs(args).utc);
};
const A = parse('a'), B = parse('b');
const has = (c, g) => !!c.active[g];

const out = { electromagnetic: [], companionship: [], dominance: [], compromise: [] };
for (const [x, y] of HD.CHANNELS) {
  const a = [has(A, x), has(A, y)], b = [has(B, x), has(B, y)];
  const aFull = a[0] && a[1], bFull = b[0] && b[1], aAny = a[0] || a[1], bAny = b[0] || b[1];
  const key = HD.channelKey(x, y), name = HDRead.CHANNEL[key][0];
  const item = { channel: key, name, keynote: HDRead.CHANNEL[key][1] };
  if (aFull && bFull) out.companionship.push(item);
  else if (aFull || bFull) {
    const other = aFull ? bAny : aAny;
    out[other ? 'compromise' : 'dominance'].push({ ...item, whole: aFull ? 'A' : 'B' });
  } else if (aAny && bAny && ((a[0] && b[1] && !a[1] && !b[0]) || (a[1] && b[0] && !a[0] && !b[1]))) {
    out.electromagnetic.push({ ...item, gateA: a[0] ? x : y, gateB: b[0] ? x : y });
  }
}
const summary = (c) => c.type + ', ' + c.authority + ' authority, profile ' + c.profile + ', ' + c.definition;

if (argv.includes('--json')) {
  process.stdout.write(JSON.stringify({ a: summary(A), b: summary(B), ...out }, null, 2) + '\n');
  process.exit(0);
}
const L = ['# How these two charts connect', '', '- A: ' + summary(A), '- B: ' + summary(B), ''];
const section = (title, help, list, fmt) => {
  L.push('## ' + title + ' (' + list.length + ')', '', help, '');
  L.push(...(list.length ? list.map(fmt) : ['- none']), '');
};
section('Electromagnetic', 'Each has one half of the channel; together it is complete. This is the pull between two people, and sometimes friction.',
  out.electromagnetic, (i) => '- ' + i.name + ' (' + i.channel + '): A has gate ' + i.gateA + ', B has gate ' + i.gateB + '. Theme: ' + i.keynote + '.');
section('Companionship', 'Both have the whole channel: easy understanding in this area.',
  out.companionship, (i) => '- ' + i.name + ' (' + i.channel + '): ' + i.keynote + '.');
section('Dominance', 'One has the whole channel and the other has none of it: here one person sets the tone.',
  out.dominance, (i) => '- ' + i.name + ' (' + i.channel + '), carried by ' + i.whole + ': ' + i.keynote + '.');
section('Compromise', 'One has the whole channel and the other has one gate of it: the one with the single gate tends to give way.',
  out.compromise, (i) => '- ' + i.name + ' (' + i.channel + '), whole channel with ' + i.whole + ': ' + i.keynote + '.');
process.stdout.write(L.join('\n'));
