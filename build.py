# Builds the skill from src/:
#   skills/human-design-bodygraph/assets/bodygraph.html  the page, with every script, the data and the fonts inlined
#   skills/human-design-bodygraph/lib/                   the calculation and reading scripts, for scripts/chart.js
# Run: python3 build.py
import base64
import shutil
from pathlib import Path

here = Path(__file__).parent
src = here / 'src'
skill = here / 'skills/human-design-bodygraph'
read = lambda name: (src / name).read_text()


def face(family, file, weight):
    b64 = base64.b64encode((src / 'fonts' / file).read_bytes()).decode()
    return (f'@font-face {{ font-family: "{family}"; src: url(data:font/woff2;base64,{b64}) format("woff2"); '
            f'font-weight: {weight}; font-style: normal; font-display: swap; }}')


# Free stand-ins (SIL Open Font License) for GT Super and Aeonik, which are used instead when installed.
fonts = '\n'.join([face('Fraunces', 'fraunces.woff2', '100 900'), face('Geist', 'geist.woff2', '100 900')])

parts = {
    '/*FONTS*/': fonts,
    '/*ASTRONOMIA*/': read('astronomia.js'),
    '/*EPHDATA*/': read('ephdata.js'),
    '/*EPHEMERIS*/': read('ephemeris.js'),
    '/*DATA*/': read('data.js'),
    '/*TZ*/': '// Time zone from coordinates: @photostructure/tz-lookup (CC0).\n' + read('tzlookup.js'),
    '/*CORE*/': read('core.js'),
    '/*INTERPRET*/': read('interpret.js'),
}
html = read('template.html')
for key, value in parts.items():
    assert html.count(key) == 1, key
    html = html.replace(key, value)
(skill / 'assets').mkdir(parents=True, exist_ok=True)
(skill / 'assets/bodygraph.html').write_text(html)

(skill / 'lib').mkdir(exist_ok=True)
for name in ['astronomia.js', 'ephdata.js', 'ephemeris.js', 'core.js', 'interpret.js', 'data.js', 'tzlookup.js']:
    shutil.copy(src / name, skill / 'lib' / name)
print('built', skill.relative_to(here))
