// The page's ephemeris for Node tests, built from src/ (no packages needed).
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, '../src');
const run = (file, name) => new Function(fs.readFileSync(path.join(src, file), 'utf8') + '\nreturn ' + name + ';')();
const { createEphemeris } = require(path.join(src, 'ephemeris.js'));
module.exports = createEphemeris(run('astronomia.js', 'Astronomia'), run('ephdata.js', 'HD_EPH'));
