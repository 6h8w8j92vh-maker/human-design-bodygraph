// Human Design chart calculation. Needs the astronomy-engine global (`Astronomy`)
// in the browser, or pass the module in as `A` under Node.
(function (root) {
  'use strict';

  // The 64 gates around the zodiac, starting with Gate 41 at 302° tropical.
  const GATE_ORDER = [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59,
    40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58,
    38, 54, 61, 60];
  const WHEEL_START = 302;
  const GATE_SPAN = 360 / 64;   // 5.625°
  const LINE_SPAN = GATE_SPAN / 6; // 0.9375°

  const CENTER_GATES = {
    head: [64, 61, 63],
    ajna: [47, 24, 4, 17, 43, 11],
    throat: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
    g: [1, 13, 25, 46, 2, 15, 10, 7],
    heart: [21, 40, 26, 51],
    spleen: [48, 57, 44, 50, 32, 28, 18],
    solar: [6, 37, 22, 36, 30, 55, 49],
    sacral: [5, 14, 29, 59, 9, 3, 42, 27, 34],
    root: [58, 38, 54, 53, 60, 52, 19, 39, 41],
  };
  const CENTER_NAMES = {
    head: 'Head', ajna: 'Ajna', throat: 'Throat', g: 'G', heart: 'Heart',
    spleen: 'Spleen', solar: 'Solar Plexus', sacral: 'Sacral', root: 'Root',
  };
  const GATE_CENTER = {};
  for (const [c, gates] of Object.entries(CENTER_GATES)) for (const g of gates) GATE_CENTER[g] = c;

  const CHANNELS = [
    [64, 47], [61, 24], [63, 4],
    [17, 62], [43, 23], [11, 56],
    [16, 48], [20, 57], [20, 34], [20, 10], [31, 7], [8, 1], [33, 13], [45, 21], [35, 36], [12, 22],
    [10, 34], [10, 57], [25, 51], [46, 29], [2, 14], [15, 5],
    [26, 44], [40, 37],
    [57, 34], [50, 27], [32, 54], [28, 38], [18, 58],
    [59, 6], [42, 53], [3, 60], [9, 52],
    [39, 55], [41, 30], [19, 49],
  ];

  const MOTORS = ['sacral', 'solar', 'heart', 'root'];

  // Ra Uru Hu's gate names.
  const GATE_NAMES = {
    1: 'Self-Expression', 2: 'Direction of the Self', 3: 'Ordering', 4: 'Formulization', 5: 'Fixed Rhythms',
    6: 'Friction', 7: 'The Role of the Self', 8: 'Contribution', 9: 'Focus', 10: 'Behavior of the Self',
    11: 'Ideas', 12: 'Caution', 13: 'The Listener', 14: 'Power Skills', 15: 'Extremes', 16: 'Skills',
    17: 'Opinions', 18: 'Correction', 19: 'Wanting', 20: 'The Now', 21: 'The Hunter', 22: 'Openness',
    23: 'Assimilation', 24: 'Rationalization', 25: 'The Spirit of the Self', 26: 'The Egoist', 27: 'Caring',
    28: 'The Game Player', 29: 'Perseverance', 30: 'Recognition of Feelings', 31: 'Influence', 32: 'Continuity',
    33: 'Privacy', 34: 'Power', 35: 'Change', 36: 'Crisis', 37: 'Friendship', 38: 'The Fighter',
    39: 'The Provocateur', 40: 'Aloneness', 41: 'Contraction', 42: 'Growth', 43: 'Insight', 44: 'Alertness',
    45: 'The Gatherer', 46: 'Determination of the Self', 47: 'Realizing', 48: 'Depth', 49: 'Principles',
    50: 'Values', 51: 'Shock', 52: 'Stillness', 53: 'Beginnings', 54: 'Ambition', 55: 'Spirit',
    56: 'Stimulation', 57: 'Intuitive Clarity', 58: 'Vitality', 59: 'Sexuality', 60: 'Acceptance',
    61: 'Mystery', 62: 'Details', 63: 'Doubt', 64: 'Confusion',
  };

  // Circuit groups, keyed "low-high".
  const CIRCUIT = {};
  for (const [name, keys] of Object.entries({
    'Individual Knowing': ['1-8', '2-14', '3-60', '12-22', '23-43', '24-61', '28-38', '39-55', '20-57'],
    'Individual Centering': ['10-34', '25-51'],
    'Integration': ['10-20', '10-57', '20-34', '34-57'],
    'Collective Understanding': ['4-63', '5-15', '7-31', '9-52', '16-48', '17-62', '18-58'],
    'Collective Sensing': ['11-56', '13-33', '29-46', '30-41', '35-36', '42-53', '47-64'],
    'Tribal Ego': ['19-49', '21-45', '26-44', '32-54', '37-40'],
    'Tribal Defense': ['6-59', '27-50'],
  })) for (const k of keys) CIRCUIT[k] = name;
  const channelKey = (a, b) => Math.min(a, b) + '-' + Math.max(a, b);

  // The four quarters of the wheel, by Personality Sun gate.
  const QUARTERS = [
    ['Initiation', 'purpose fulfilled through the mind', [13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24]],
    ['Civilization', 'purpose fulfilled through form', [2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33]],
    ['Duality', 'purpose fulfilled through bonding', [7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44]],
    ['Mutation', 'purpose fulfilled through transformation', [1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60, 41, 19]],
  ];

  // Variables: colour names per arrow, and the arrow direction from the tone (1-3 left, 4-6 right).
  const VARIABLE_COLORS = {
    Determination: ['Appetite', 'Taste', 'Thirst', 'Touch', 'Sound', 'Light'],
    Environment: ['Caves', 'Markets', 'Kitchens', 'Mountains', 'Valleys', 'Shores'],
    Motivation: ['Fear', 'Hope', 'Desire', 'Need', 'Guilt', 'Innocence'],
    Perspective: ['Survival', 'Possibility', 'Power', 'Wanting', 'Probability', 'Personal'],
  };
  const SIGNS = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

  const BODIES = ['Sun', 'Earth', 'NorthNode', 'SouthNode', 'Moon', 'Mercury', 'Venus',
    'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

  const LINE_NAMES = ['', 'Investigator', 'Hermit', 'Martyr', 'Opportunist', 'Heretic', 'Role Model'];

  const TYPE_INFO = {
    'Manifestor': { strategy: 'To inform', signature: 'Peace', notSelf: 'Anger' },
    'Generator': { strategy: 'To respond', signature: 'Satisfaction', notSelf: 'Frustration' },
    'Manifesting Generator': { strategy: 'To respond', tip: 'Inform others before you act', signature: 'Satisfaction', notSelf: 'Frustration and anger' },
    'Projector': { strategy: 'Wait for the invitation', signature: 'Success', notSelf: 'Bitterness' },
    'Reflector': { strategy: 'Wait a lunar cycle', signature: 'Surprise', notSelf: 'Disappointment' },
  };

  // table: { gate: [rightAngleName, juxtapositionName, leftAngleName] }
  function crossName(table, angle, sunGate) {
    const names = table && table[sunGate];
    if (!names) return angle + ' Cross';
    const name = names[angle === 'Right Angle' ? 0 : angle === 'Juxtaposition' ? 1 : 2].replace(/^The /, 'the ');
    return angle + ' Cross of ' + name;
  }

  const norm = (x) => ((x % 360) + 360) % 360;

  // Longitude -> gate, line, colour, tone, base (6 colours per line, 6 tones per colour, 5 bases per tone).
  function gateLine(lon) {
    const d = norm(lon - WHEEL_START);
    const idx = Math.floor(d / GATE_SPAN);
    let r = d - idx * GATE_SPAN;
    const line = Math.floor(r / LINE_SPAN); r -= line * LINE_SPAN;
    const cs = LINE_SPAN / 6, color = Math.floor(r / cs); r -= color * cs;
    const ts = cs / 6, tone = Math.floor(r / ts); r -= tone * ts;
    const base = Math.floor(r / (ts / 5));
    const L = norm(lon);
    return {
      gate: GATE_ORDER[idx], line: line + 1, color: color + 1, tone: tone + 1, base: base + 1, lon: L,
      sign: SIGNS[Math.floor(L / 30)], deg: Math.floor(L % 30), min: Math.floor((L % 1) * 60),
    };
  }

  // E: an ephemeris (see ephemeris.js). Positions for a UT Julian day, plus Earth and South Node opposite.
  function longitudes(E, jd) {
    const l = E.longitudes(jd);
    return { ...l, Earth: norm(l.Sun + 180), SouthNode: norm(l.NorthNode + 180) };
  }
  const toJd = (date) => date.getTime() / 864e5 + 2440587.5;
  const fromJd = (jd) => new Date(Math.round((jd - 2440587.5) * 864e5));

  // Local wall-clock time in an IANA zone -> UTC Date (handles historical offsets and DST).
  function zonedToUtc(y, mo, d, h, mi, timeZone) {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
    });
    const offset = (ms) => {
      const p = {};
      for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = +part.value;
      return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - ms;
    };
    const wall = Date.UTC(y, mo - 1, d, h, mi);
    let utc = wall - offset(wall);
    utc = wall - offset(utc);
    return new Date(utc);
  }

  function activations(lons, later) {
    return BODIES.map((body) => {
      const a = { body, ...gateLine(lons[body]) };
      if (later && !/Sun|Earth|Node/.test(body)) a.retro = ((later[body] - lons[body] + 540) % 360) - 180 < 0;
      return a;
    });
  }

  function analyze(personality, design) {
    const active = {};
    const mark = (list, side) => {
      for (const a of list) (active[a.gate] = active[a.gate] || { p: false, d: false })[side] = true;
    };
    mark(personality, 'p');
    mark(design, 'd');

    const channels = CHANNELS.filter(([a, b]) => active[a] && active[b]);
    const defined = new Set();
    const adj = {};
    for (const c of Object.keys(CENTER_GATES)) adj[c] = new Set();
    for (const [a, b] of channels) {
      const ca = GATE_CENTER[a], cb = GATE_CENTER[b];
      defined.add(ca); defined.add(cb);
      adj[ca].add(cb); adj[cb].add(ca);
    }

    // Connected groups of defined centers.
    const groupOf = {};
    let groups = 0;
    for (const c of defined) {
      if (groupOf[c] !== undefined) continue;
      const stack = [c];
      groupOf[c] = groups;
      while (stack.length) {
        for (const n of adj[stack.pop()]) {
          if (groupOf[n] === undefined) { groupOf[n] = groups; stack.push(n); }
        }
      }
      groups++;
    }
    const linked = (a, b) => defined.has(a) && defined.has(b) && groupOf[a] === groupOf[b];

    // Undefined (has active gates) versus completely open (none), and the active gates per center.
    const centers = {};
    for (const c of Object.keys(CENTER_GATES)) {
      const gates = CENTER_GATES[c].filter((g) => active[g]);
      centers[c] = { state: defined.has(c) ? 'defined' : gates.length ? 'undefined' : 'open', gates };
    }
    // Gates that would join two separate parts of a split definition with one activation.
    const bridges = [];
    if (groups > 1) {
      for (const [a, b] of CHANNELS) {
        const ca = GATE_CENTER[a], cb = GATE_CENTER[b];
        if (!defined.has(ca) || !defined.has(cb) || groupOf[ca] === groupOf[cb]) continue;
        if (active[a] && !active[b]) bridges.push(b);
        if (active[b] && !active[a]) bridges.push(a);
      }
    }
    const motorToThroat = (motors) => motors.some((m) => linked(m, 'throat'));

    let type;
    if (defined.size === 0) type = 'Reflector';
    else if (defined.has('sacral')) type = motorToThroat(MOTORS) ? 'Manifesting Generator' : 'Generator';
    else if (motorToThroat(['solar', 'heart', 'root'])) type = 'Manifestor';
    else type = 'Projector';

    let authority;
    if (defined.has('solar')) authority = 'Emotional';
    else if (defined.has('sacral')) authority = 'Sacral';
    else if (defined.has('spleen')) authority = 'Splenic';
    else if (defined.has('heart')) authority = linked('heart', 'throat') ? 'Ego Manifested' : 'Ego Projected';
    else if (linked('g', 'throat')) authority = 'Self-Projected';
    else if (type === 'Reflector') authority = 'Lunar';
    else authority = 'Mental';

    const definition = ['No Definition', 'Single Definition', 'Split Definition',
      'Triple Split Definition', 'Quadruple Split Definition'][groups];

    const pSun = personality[0], pEarth = personality[1];
    const dSun = design[0], dEarth = design[1];
    const profile = `${pSun.line}/${dSun.line}`;
    const angle = profile === '4/1' ? 'Juxtaposition' : pSun.line >= 5 ? 'Left Angle' : 'Right Angle';

    const quarter = QUARTERS.find((q) => q[2].includes(personality[0].gate));
    const variable = (name, a) => ({ name, color: a.color, tone: a.tone, arrow: a.tone <= 3 ? 'left' : 'right', label: VARIABLE_COLORS[name][a.color - 1] });
    const variables = [
      variable('Determination', design[0]), variable('Environment', design[2]),
      variable('Motivation', personality[0]), variable('Perspective', personality[2]),
    ];

    return {
      active, channels, defined: [...defined], centers, bridges: [...new Set(bridges)].sort((x, y) => x - y),
      wideSplit: groups > 1 && !bridges.length, quarter: { name: quarter[0], theme: quarter[1] }, variables,
      type, ...TYPE_INFO[type], authority, definition,
      profile, profileName: `${LINE_NAMES[pSun.line]} / ${LINE_NAMES[dSun.line]}`,
      cross: {
        angle, gates: `${pSun.gate}/${pEarth.gate} | ${dSun.gate}/${dEarth.gate}`,
        name: crossName(typeof HD_CROSSES !== 'undefined' ? HD_CROSSES : null, angle, pSun.gate),
      },
    };
  }

  // The Design moment: when the Sun stood 88 degrees before its place at birth (about 89 days earlier).
  const designJd = (E, jdP, sunP) => E.sunAt(norm(sunP - 88), jdP - 89.3);

  // utcDate: JS Date of birth in UTC.
  // opts.motion: also work out which planets are retrograde (costs a second set of positions).
  function chart(E, utcDate, opts = {}) {
    const jdP = toJd(utcDate);
    const pLons = longitudes(E, jdP);
    const jdD = designJd(E, jdP, pLons.Sun);
    const personality = activations(pLons, opts.motion ? longitudes(E, jdP + 1 / 24) : null);
    const design = activations(longitudes(E, jdD), opts.motion ? longitudes(E, jdD + 1 / 24) : null);
    return { birthUtc: utcDate, designUtc: fromJd(jdD), personality, design, ...analyze(personality, design) };
  }

  // How far the birth time can move before any activation changes gate or line.
  // Returns { before, after } in minutes (capped at maxMin) plus what changes first on each side.
  // Each position's speed predicts when it next crosses a line boundary; exact charts then confirm the minute.
  function stability(E, utcDate, maxMin = 180) {
    const key = (c) => [...c.personality, ...c.design].map((a) => a.gate + '.' + a.line).join(' ');
    const base = chart(E, utcDate);
    const ref = key(base);
    const at = (min) => chart(E, new Date(utcDate.getTime() + min * 60000));

    // Degrees per minute of birth time for every activation. The Design moment moves with the birth
    // time at the ratio of the Sun's speeds at both moments.
    const jdP = toJd(utcDate), jdD = toJd(base.designUtc), h = 5 / 1440;
    const rates = (jd) => {
      const a = longitudes(E, jd - h), b = longitudes(E, jd + h);
      return BODIES.map((body) => (((b[body] - a[body] + 540) % 360) - 180) / (2 * h * 1440));
    };
    const rP = rates(jdP), rD = rates(jdD);
    const follow = rP[0] / rD[0];
    const moving = [...base.personality.map((a, i) => [a.lon, rP[i]]), ...base.design.map((a, i) => [a.lon, rD[i] * follow])];
    const predict = (dir) => Math.min(...moving.map(([lon, rate]) => {
      const f = (norm(lon - WHEEL_START) / LINE_SPAN) % 1, v = rate * dir;
      return v === 0 ? Infinity : (v > 0 ? 1 - f : f) * LINE_SPAN / Math.abs(v);
    }));

    const firstChange = (dir) => {
      const same = (m) => key(at(dir * m)) === ref;
      const none = { minutes: maxMin, change: null };
      // The prediction is good to a fraction of a minute; if it is off, widen the search step by step.
      const guess = Math.min(Math.floor(predict(dir)), maxMin);
      let ok, bad;
      if (guess > 0 && !same(guess)) { ok = 0; bad = guess; }
      else {
        ok = guess;
        if (ok === maxMin) return none;
        for (let step = 1; ; step *= 2) {
          const m = Math.min(ok + step, maxMin);
          if (!same(m)) { bad = m; break; }
          ok = m;
          if (ok === maxMin) return none;
        }
      }
      while (bad - ok > 1) {
        const mid = (ok + bad) >> 1;
        if (same(mid)) ok = mid; else bad = mid;
      }
      const moved = at(dir * bad);
      const sides = [['Personality', 'personality'], ['Design', 'design']];
      for (const [label, side] of sides) {
        for (let i = 0; i < BODIES.length; i++) {
          const a = base[side][i], b = moved[side][i];
          if (a.gate !== b.gate || a.line !== b.line) {
            return { minutes: ok, change: { side: label, body: BODIES[i], from: a.gate + '.' + a.line, to: b.gate + '.' + b.line } };
          }
        }
      }
      return { minutes: ok, change: null };
    };
    return { before: firstChange(-1), after: firstChange(1), maxMin };
  }

  const ORDER = Object.keys(CENTER_GATES);

  const api = { GATE_NAMES, CIRCUIT, channelKey, QUARTERS, stability, ORDER, crossName, TYPE_INFO, GATE_ORDER, CENTER_GATES, CENTER_NAMES, GATE_CENTER, CHANNELS, BODIES, gateLine, zonedToUtc, chart, longitudes, analyze };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HD = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
