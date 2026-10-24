#!/usr/bin/env node
// Writes the animated bodygraph page with a birth filled in; it calculates and assembles on opening.
// Usage: node page.js --date 1988-03-21 --time 08:15 --tz Europe/Amsterdam [--place "Amsterdam"] [--out bodygraph.html]
const fs = require('fs');
const path = require('path');
const { birthArgs } = require('./load.js');

const b = birthArgs(process.argv.slice(2), ['out']);
const out = path.resolve(b.out || 'bodygraph.html');
const html = fs.readFileSync(path.join(__dirname, '..', 'assets', 'bodygraph.html'), 'utf8');
const prefill = { date: b.date, time: b.time.padStart(5, '0'), tz: b.tz, place: b.place || '' };
const tag = '<script>window.HD_PREFILL = ' + JSON.stringify(prefill).replace(/</g, '\\u003c') + ';</script>\n';
const at = html.indexOf('<script>');
fs.writeFileSync(out, html.slice(0, at) + tag + html.slice(at));
console.log(out);
