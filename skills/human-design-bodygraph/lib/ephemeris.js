// Planet positions for Human Design charts: geocentric, apparent, tropical ecliptic longitude of date,
// the way Swiss Ephemeris gives them (the reference most Human Design software uses).
//   Sun, Mercury, Venus, Mars: VSOP87B, slimmed (under 0.05" from the full theory, 1800-2200).
//   Jupiter to Pluto: Chebyshev fits to NASA JPL DE431, 1800-2200 (under 0.01").
//   Moon and true lunar node: ELP/MPP02 (DE405 fit), slimmed (under 0.05").
//   Delta T: yearly table 1700-2201 (Swiss Ephemeris values), Espenak-Meeus formulas outside it.
// Math by the MIT-licensed astronomia library (IAU 1976 precession, IAU 1980 nutation), with the
// longitude corrected to the IAU 2006 precession rate that Swiss Ephemeris uses.
(function (root) {
  'use strict';
  const FIRST_JD = 2378496.5, LAST_JD = 2524593.5;   // 1800-01-01 .. 2200-01-01

  function createEphemeris(A, pack) {
    const R2D = 180 / Math.PI, S2R = Math.PI / 180 / 3600;
    const norm = (x) => ((x % 360) + 360) % 360;
    const EARTH = new A.planetposition.Planet(pack.vsop.earth);
    const INNER = {};
    for (const p of ['mercury', 'venus', 'mars']) INNER[p] = new A.planetposition.Planet(pack.vsop[p]);
    const MOON = new A.elp.Moon(pack.elp);
    const OUTER = pack.outer;

    function deltaT(jd) {
      const dt = pack.deltat;
      const year = 2000 + (jd - 2451545.0) / 365.25 - 0.5;
      const i = Math.floor(year - dt.first);
      if (i >= 0 && i < dt.values.length - 1) return dt.values[i] + (dt.values[i + 1] - dt.values[i]) * (year - dt.first - i);
      const cal = A.julian.JDToCalendar(jd);
      return A.deltat.deltaT(cal.year + (cal.month - 1) / 12);
    }
    const jdeOf = (jd) => jd + deltaT(jd) / 86400;

    // astronomia precesses with IAU 1976; IAU 2006 (Swiss Ephemeris) has a slightly slower rate.
    const precessionFix = (jde) => { const T = (jde - 2451545) / 36525; return (-0.300405 * T - 0.0057 * T * T) * S2R; };

    // Heliocentric position of date in the FK5 frame, for VSOP87 bodies.
    function vsopOfDate(planet, jde) {
      const p = planet.position(jde);
      const fk5 = A.planetposition.toFK5(p.lon, p.lat, jde);
      return { lon: fk5.lon, lat: fk5.lat, range: p.range };
    }

    // Heliocentric position of date for the slow planets, from the J2000 Chebyshev tables.
    function outerOfDate(name, jde) {
      const b = OUTER.bodies[name], k = Math.min(Math.floor((jde - OUTER.start) / b.len), b.segs.length - 1);
      const x = (2 * (jde - OUTER.start - k * b.len)) / b.len - 1, seg = b.segs[k];
      const xyz = [0, 1, 2].map((ax) => {
        const c = seg[ax];
        let b0 = 0, b1 = 0, b2;
        for (let j = c.length - 1; j >= 1; j--) { b2 = b1; b1 = b0; b0 = 2 * x * b1 - b2 + c[j]; }
        return (x * b0 - b1 + c[0]) * OUTER.unit;
      });
      const range = Math.hypot(xyz[0], xyz[1], xyz[2]);
      const ecl = A.precess.eclipticPosition(new A.coord.Ecliptic(Math.atan2(xyz[1], xyz[0]), Math.asin(xyz[2] / range)),
        2000, A.base.JDEToJulianYear(jde));
      return { lon: ecl.lon, lat: ecl.lat, range };
    }

    const SUN_SCHWARZSCHILD_AU = 1.97412574336e-8;
    const xyz = (p) => [p.range * Math.cos(p.lat) * Math.cos(p.lon), p.range * Math.cos(p.lat) * Math.sin(p.lon), p.range * Math.sin(p.lat)];
    const unit = (v) => { const n = Math.hypot(v[0], v[1], v[2]); return [v[0] / n, v[1] / n, v[2] / n]; };
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

    // Geocentric apparent longitude: light-time, the Sun's light deflection, annual aberration, nutation.
    function apparent(helio, jde) {
      const earth = xyz(vsopOfDate(EARTH, jde));
      let planet, geo;
      const at = (tau) => {
        planet = xyz(helio(jde - tau));
        geo = [planet[0] - earth[0], planet[1] - earth[1], planet[2] - earth[2]];
      };
      at(0);
      at(A.base.lightTime(Math.hypot(geo[0], geo[1], geo[2])));
      // Light passing the Sun bends (1.75" at the Sun's edge); same formula as IAU SOFA iauLd.
      const p = unit(geo), q = unit(planet), e = unit(earth), em = Math.hypot(earth[0], earth[1], earth[2]);
      const w = SUN_SCHWARZSCHILD_AU / em / Math.max(dot(q, [q[0] + e[0], q[1] + e[1], q[2] + e[2]]), 1e-9);
      const d = cross(p, cross(e, q));
      const [x, y, z] = [p[0] + w * d[0], p[1] + w * d[1], p[2] + w * d[2]];
      const lon = Math.atan2(y, x), lat = Math.atan2(z, Math.hypot(x, y));
      const ab = A.apparent.eclipticAberration(lon, lat, jde);
      return norm((lon + ab[0] + A.nutation.nutation(jde)[0] + precessionFix(jde)) * R2D);
    }

    function sunJde(jde) { return norm((A.solar.apparentVSOP87(EARTH, jde).lon + precessionFix(jde)) * R2D); }
    function sun(jd) { return sunJde(jdeOf(jd)); }

    const moonXYZ = (t) => {
      const c = MOON.position(t), cl = Math.cos(c.lat);
      return [c.range * cl * Math.cos(c.lon), c.range * cl * Math.sin(c.lon), c.range * Math.sin(c.lat), c];
    };
    // Moon (with light-time) and the osculating ("true") ascending node, both apparent of date.
    function moonAndNode(jde) {
      const dpsi = A.nutation.nutation(jde)[0];
      const t = jde - A.base.lightTime(MOON.position(jde).range / 149597870.7), h = 1 / 1440;
      const p = moonXYZ(t), a = moonXYZ(t - h), b = moonXYZ(t + h);
      const v = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const hx = p[1] * v[2] - p[2] * v[1], hy = p[2] * v[0] - p[0] * v[2];
      return { moon: norm((p[3].lon + dpsi) * R2D), node: norm((Math.atan2(hx, -hy) + dpsi) * R2D) };
    }

    // All bodies for a UT Julian day.
    function longitudes(jd) {
      if (jd < FIRST_JD || jd >= LAST_JD) throw new RangeError('Charts can be calculated for births from 1801 to 2199.');
      const jde = jdeOf(jd), mn = moonAndNode(jde);
      const inner = (p) => apparent((t) => vsopOfDate(INNER[p], t), jde);
      const outer = (p) => apparent((t) => outerOfDate(p, t), jde);
      return {
        Sun: sunJde(jde), Moon: mn.moon, NorthNode: mn.node,
        Mercury: inner('mercury'), Venus: inner('venus'), Mars: inner('mars'),
        Jupiter: outer('jupiter'), Saturn: outer('saturn'), Uranus: outer('uranus'), Neptune: outer('neptune'), Pluto: outer('pluto'),
      };
    }

    // UT Julian day, near jdGuess, when the apparent Sun stands at `target` degrees (secant steps).
    function sunAt(target, jdGuess) {
      const off = (jd) => ((sun(jd) - target + 540) % 360) - 180;
      let j0 = jdGuess, f0 = off(j0), j1 = j0 - f0 / 0.9856, f1 = off(j1);
      for (let k = 0; k < 12 && Math.abs(j1 - j0) > 1e-8; k++) {
        const j2 = j1 - f1 * (j1 - j0) / (f1 - f0);
        j0 = j1; f0 = f1; j1 = j2; f1 = off(j1);
      }
      return j1;
    }

    return { longitudes, sun, sunAt, deltaT, firstJd: FIRST_JD, lastJd: LAST_JD };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { createEphemeris };
  else root.createEphemeris = createEphemeris;
})(typeof globalThis !== 'undefined' ? globalThis : this);
