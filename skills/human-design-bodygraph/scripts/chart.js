#!/usr/bin/env node
// Human Design chart and plain-language reading, as Markdown (default) or JSON (--json).
// Usage: node chart.js --date 1988-03-21 --time 08:15 --tz Europe/Amsterdam [--place "Amsterdam"] [--json]
//        node chart.js --date 1988-03-21 --time 08:15 --lat 52.37 --lon 4.89
const { HD, HDRead, EPH, birthArgs } = require('./load.js');

const b = birthArgs(process.argv.slice(2));
const c = HD.chart(EPH, b.utc, { motion: true });
let s = null;
try { s = HD.stability(EPH, b.utc); } catch (e) { /* within three hours of the table limits */ }
const reading = HDRead.reading(c);

const clock = (m) => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
const utcText = (dt) => dt.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';

// Same wording as the page's birth-time check.
function birthTime() {
  if (!s) return null;
  const local = b.h * 60 + b.mi, margin = Math.min(s.before.minutes, s.after.minutes), step = margin + 1;
  const verdict = margin >= 30 ? 'The birth time can be off by up to ' + margin + ' minutes without changing this chart.'
    : margin >= 10 ? 'If the birth time is off by ' + step + ' minutes, this chart changes. Check the time if you can.'
    : margin >= 1 ? 'This chart is sensitive: if the birth time is off by ' + step + ' minutes, it changes. An exact birth time matters here.'
    : 'The birth time sits right on a boundary: one minute ' + (s.before.minutes === 0 && s.after.minutes === 0 ? 'earlier or later' : s.after.minutes === 0 ? 'later' : 'earlier') + ' already changes this chart.';
  const label = (x) => x.side + ' ' + x.body.replace('Node', ' Node') + ' moves from ' + x.from + ' to ' + x.to;
  const parts = [verdict];
  if (s.before.minutes > 0 && s.after.minutes > 0) {
    parts.push('The chart stays the same from ' + (s.before.minutes >= s.maxMin ? 'before ' : '') + clock(local - s.before.minutes) + ' to ' +
      clock(local + s.after.minutes) + (s.after.minutes >= s.maxMin ? ' or later' : '') + ' (local time).');
  }
  if (s.before.change) parts.push('Earlier, ' + label(s.before.change) + '.');
  if (s.after.change) parts.push('Later, ' + label(s.after.change) + '.');
  return { before: s.before, after: s.after, maxMinutes: s.maxMin, text: parts.join(' ') };
}
const check = birthTime();

const act = (a) => ({ planet: a.body, gate: a.gate, line: a.line, color: a.color, tone: a.tone, base: a.base,
  longitude: +a.lon.toFixed(6), zodiac: a.deg + '°' + String(a.min).padStart(2, '0') + "' " + a.sign, retrograde: !!a.retro });
const centers = Object.fromEntries(HD.ORDER.map((k) => [k, { name: HD.CENTER_NAMES[k], state: c.centers[k].state, gates: c.centers[k].gates }]));
const channels = c.channels.map(([x, y]) => {
  const key = HD.channelKey(x, y);
  return { channel: key, name: HDRead.CHANNEL[key][0], circuit: HD.CIRCUIT[key] };
});

if (b.json) {
  process.stdout.write(JSON.stringify({
    birth: { date: b.date, time: b.time, timeZone: b.tz, place: b.place || null, utc: b.utc.toISOString() },
    designUtc: c.designUtc.toISOString(),
    type: c.type, strategy: c.strategy, signature: c.signature, notSelf: c.notSelf, authority: c.authority,
    profile: c.profile, profileName: c.profileName, definition: c.definition, cross: c.cross, quarter: c.quarter,
    centers, channels, splitBridges: c.bridges, variables: c.variables,
    personality: c.personality.map(act), design: c.design.map(act),
    birthTimeCheck: check, reading,
  }, null, 2) + '\n');
  process.exit(0);
}

const L = [];
L.push('# Human Design chart', '');
L.push('Birth: ' + b.date + ' ' + b.time + ' ' + b.tz + (b.place ? ' (' + b.place + ')' : '') + ' = ' + utcText(b.utc) + '. Design moment: ' + utcText(c.designUtc) + '.', '');
L.push('- **Type:** ' + c.type + ' (strategy: ' + c.strategy.toLowerCase() + (c.tip ? '; ' + c.tip.toLowerCase() : '') + ')');
L.push('- **Authority:** ' + c.authority);
L.push('- **Profile:** ' + c.profile + ' (' + c.profileName + ')');
L.push('- **Definition:** ' + c.definition + (c.bridges.length ? ' (bridging gates: ' + c.bridges.join(', ') + ')' : ''));
L.push('- **Incarnation Cross:** ' + c.cross.name + ' (' + c.cross.gates + ')');
L.push('- **Signature / not-self theme:** ' + c.signature + ' / ' + c.notSelf);
L.push('');
if (check) L.push('## Birth-time check', '', check.text, '');
L.push('## Activations', '', '| Planet | Personality (black) | Design (red) |', '|---|---|---|');
c.personality.forEach((p, i) => {
  const d = c.design[i], cell = (a) => a.gate + '.' + a.line + (a.retro ? ' R' : '');
  L.push('| ' + p.body.replace('Node', ' Node') + ' | ' + cell(p) + ' | ' + cell(d) + ' |');
});
L.push('');
const byState = (st) => HD.ORDER.filter((k) => c.centers[k].state === st).map((k) => HD.CENTER_NAMES[k]);
L.push('## Centers', '', '- Defined: ' + (byState('defined').join(', ') || 'none'), '- Undefined (has gates): ' + (byState('undefined').join(', ') || 'none'), '- Open (no gates): ' + (byState('open').join(', ') || 'none'), '');
L.push('## Channels', '');
L.push(...(channels.length ? channels.map((x) => '- ' + x.channel + ' ' + x.name + ' (' + x.circuit + ')') : ['- none']), '');
L.push('## Variables (advanced)', '', ...c.variables.map((v) => '- ' + v.name + ': ' + v.label + ', colour ' + v.color + ', tone ' + v.tone + ', arrow ' + v.arrow), '');
L.push('## Reading', '');
for (const sec of reading) {
  L.push('### ' + sec.heading + (sec.deeper ? ' (go deeper)' : ''), '');
  for (const p of sec.paragraphs) L.push(p, '');
  if (sec.items && sec.items.length) L.push(...sec.items.map((t) => '- ' + t), '');
}
process.stdout.write(L.join('\n'));
