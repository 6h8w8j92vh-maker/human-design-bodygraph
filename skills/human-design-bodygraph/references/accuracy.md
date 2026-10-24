# How the chart is calculated and checked

## Positions
- Personality: the moment of birth. Design: the moment the Sun stood exactly 88 degrees of longitude
  earlier (about 88 to 89 days before birth), found to a fraction of a second.
- 13 bodies per side: Sun, Earth (Sun + 180), true North Node, South Node (+ 180), Moon, Mercury, Venus,
  Mars, Jupiter, Saturn, Uranus, Neptune, Pluto. Geocentric, apparent, tropical longitude of date.
- Gate wheel: 64 gates of 5.625 degrees starting with gate 41 at 302 degrees; 6 lines per gate,
  then colour, tone and base.
- Sun, Mercury, Venus, Mars: VSOP87B. Jupiter to Pluto: Chebyshev tables fitted to NASA JPL DE431.
  Moon and true node: ELP/MPP02. Light-time, the Sun's light deflection, aberration, nutation, and the
  IAU 2006 precession rate are applied, as in Swiss Ephemeris. Delta T: yearly values 1700-2201.

## Test against Swiss Ephemeris with its full JPL files (10,000 random births, 1801-2199)
| Body | Typical error | Largest error |
|---|---|---|
| Sun, Moon, Mercury, Venus | 0.02-0.03" | 0.07-0.13" |
| Jupiter, Saturn, Uranus, Neptune, Pluto | 0.01-0.03" | 0.03-0.06" |
| Mars | 0.04" | 1.0" |
| True node | 0.2" | 0.7" |

A line is 3,375 arcseconds wide. Result: 9,998 of 10,000 charts identical in every gate and line; 2 differed
by one line of the Design Moon. The Design moment was never more than 0.8 seconds off.

For comparison, on 2,000 of the same births: pyhd (Swiss Ephemeris in Moshier mode) had at least one
different line in 13 charts (0.65%). In 199 charts where both engines had identical positions, pyhd said
Generator although a motor (here the Sacral itself) connects to the Throat, which makes them Manifesting
Generators under Jovian Archive's rules.

## Chart rules (Jovian Archive)
- Defined center: part of at least one complete channel. Undefined: has gates but no channel. Open: no gates.
- Reflector: no defined center. Generator: Sacral defined. Manifesting Generator: Sacral defined and a motor
  (Sacral, Solar Plexus, Heart or Root) connected to the Throat, directly or through other defined centers.
  Manifestor: Sacral undefined and a motor connected to the Throat. Projector: all others.
- Authority, in order: Emotional (Solar Plexus), Sacral, Splenic, Ego (Heart; Manifested when connected to
  the Throat, otherwise Projected), Self-Projected (G connected to Throat), Mental (Projectors with no inner
  authority), Lunar (Reflectors).
- Profile: line of the Personality Sun / line of the Design Sun. Cross: Personality Sun and Earth, Design
  Sun and Earth; Right Angle for profiles 1/3 to 4/6, Juxtaposition for 4/1, Left Angle for 5/1 to 6/3.

## Published charts used as fixtures
Ra Uru Hu (full chart from Jovian Archive: Manifestor, Splenic, 5/1, Left Angle Cross of the Clarion),
and the published types of Albert Einstein, Barack Obama and Oprah Winfrey (Astro-Databank AA birth data).

## The birth-time check
For each of the 26 positions, its speed predicts the minute it next crosses a line boundary, before and
after the given time (the Design side moves with the birth time at the ratio of the two Sun speeds). Exact
charts then confirm the minute. Matches a minute-by-minute scan in every chart tested.
