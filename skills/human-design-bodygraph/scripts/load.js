// Loads the chart code in ../lib for the command-line scripts, and reads their shared arguments.
const fs = require('fs');
const path = require('path');

const lib = path.join(__dirname, '..', 'lib');
const run = (file, names) => new Function(fs.readFileSync(path.join(lib, file), 'utf8') + '\nreturn {' + names + '};')();

const { Astronomia } = run('astronomia.js', 'Astronomia');
const { HD_EPH } = run('ephdata.js', 'HD_EPH');
const { HD_CROSSES, HD_CITIES } = run('data.js', 'HD_CROSSES, HD_CITIES');
global.HD_CROSSES = HD_CROSSES;
const HD = require(path.join(lib, 'core.js'));
global.HD = HD;
const HDRead = require(path.join(lib, 'interpret.js'));
const tzlookup = require(path.join(lib, 'tzlookup.js'));
const EPH = require(path.join(lib, 'ephemeris.js')).createEphemeris(Astronomia, HD_EPH);

function fail(msg) {
  process.stderr.write('error: ' + msg + '\n');
  process.exit(2);
}

// --date YYYY-MM-DD --time HH:MM, plus --tz Area/City, or --lat N --lon N, or --utc. Optional --place "label".
function birthArgs(argv, extra = []) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith('--')) fail('unexpected argument ' + k);
    const name = k.slice(2);
    if (['json', 'utc'].includes(name)) a[name] = true;
    else if (['date', 'time', 'tz', 'lat', 'lon', 'place', ...extra].includes(name)) a[name] = argv[++i];
    else fail('unknown option ' + k);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date || '')) fail('give --date as YYYY-MM-DD');
  if (!/^\d{1,2}:\d{2}$/.test(a.time || '')) fail('give --time as HH:MM (24-hour clock, local time of birth)');
  const [y, mo, d] = a.date.split('-').map(Number);
  const [h, mi] = a.time.split(':').map(Number);
  if (y < 1801 || y > 2199) fail('charts can be calculated for births from 1801 to 2199');
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59) fail('date or time out of range');
  let tz = a.utc ? 'UTC' : a.tz;
  if (!tz && a.lat !== undefined && a.lon !== undefined) {
    const lat = Number(a.lat), lon = Number(a.lon);
    if (!(Math.abs(lat) <= 90 && Math.abs(lon) <= 180)) fail('--lat must be -90..90 and --lon -180..180');
    tz = tzlookup(lat, lon);
  }
  if (!tz) fail('give the birth place as --tz Area/City (IANA time zone), or --lat and --lon, or --utc');
  try { new Intl.DateTimeFormat('en', { timeZone: tz }); } catch (e) { fail('"' + tz + '" is not an IANA time zone, e.g. Europe/Amsterdam'); }
  return { ...a, y, mo, d, h, mi, tz, utc: HD.zonedToUtc(y, mo, d, h, mi, tz) };
}

module.exports = { HD, HDRead, EPH, HD_CITIES, tzlookup, birthArgs, fail };
