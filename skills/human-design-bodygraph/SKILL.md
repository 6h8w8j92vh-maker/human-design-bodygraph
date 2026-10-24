---
name: human-design-bodygraph
description: Calculate a Human Design chart (bodygraph) from a birth date, time and place, matching Swiss Ephemeris, and explain it in plain language for beginners - type, strategy, authority, profile, centers, channels and talents, work, relationships, life purpose (incarnation cross) and how sensitive the chart is to the birth time. Can compare two people's charts and produce an animated bodygraph web page. Use when someone asks for their Human Design chart, bodygraph, type, authority, profile, incarnation cross, gates, channels, a reading, or how two charts connect.
---

# Human Design bodygraph

Everything is calculated by the scripts in `scripts/`, never by you. Your job is to collect the birth data,
run the scripts, and explain the result in plain words. Node.js 18 or later is all that is needed; there is
nothing to install. Run the scripts with the path of this skill folder, e.g. `node <skill>/scripts/chart.js`.

## 1. Collect the birth data

- **Date** of birth.
- **Time** of birth, to the minute. A time from a birth certificate or hospital record is best.
- **Place** of birth (the town is enough).

If the time is unknown or rough, say so before anything else: the chart can change within minutes, and
type, authority and profile can all be wrong. Only calculate with a guessed time if the person agrees, and
label everything as uncertain.

## 2. Find the time zone

The scripts need the birth place as an IANA time zone (`--tz Europe/Amsterdam`) or as coordinates
(`--lat 52.37 --lon 4.89`, the time zone is then looked up offline). Use coordinates when you know the
town's location; otherwise ask which country or region the town is in. Pass the local clock time as
written on the birth record: the scripts handle historical time zones and daylight saving time.
Do not convert to UTC yourself. Use `--utc` only if the time given is already in UTC.

## 3. Calculate

```
node <skill>/scripts/chart.js --date 1988-03-21 --time 08:15 --tz Europe/Amsterdam --place "Amsterdam"
```

Prints Markdown: the key facts, a birth-time check, all 26 activations, centers, channels, Variables and a
complete plain-language reading. Add `--json` for the same data as JSON (use it when you need to look
things up for follow-up questions). Births from 1801 to 2199 are supported.

## 4. Explain

- Start with type, strategy, authority and profile, in one or two sentences each.
- If the birth-time check says the chart changes within 30 minutes, mention it early and plainly.
- Then use the reading sections: talents, work, relationships, life purpose, the centers. Shorten or
  reorder them for the person, but keep every fact as the script gives it.
- Explain every Human Design term the first time you use it (type, authority, center, channel, gate,
  profile, incarnation cross). Short sentences, everyday words.
- Never invent or change gates, channels, centers, type or authority. Never join the four gates of the
  incarnation cross into channels. A white center with gates is "undefined"; one without gates is "open".
- Human Design is a reflective framework, not a scientific or medical test. Do not give medical, legal or
  financial advice based on a chart.

For follow-up questions, answer from the chart data (`--json`): work from type, authority, Sacral and
Heart centers and the talents; relationships from type, profile lines, emotional definition and the
single gates; purpose from the cross, its angle and quarter.

## 5. Two people

```
node <skill>/scripts/compare.js --a "1988-03-21 08:15 Europe/Amsterdam" --b "1990-07-02 14:30 40.71,-74.01"
```

Lists how the charts connect, by Jovian Archive's four kinds of connection: electromagnetic (each has one
half of a channel: attraction, sometimes friction), companionship (both have the channel), dominance (one
has the channel, the other neither gate) and compromise (one has the channel, the other one gate of it).
Present it as patterns to notice, not as a verdict on the relationship.

## 6. The animated bodygraph page (optional)

```
node <skill>/scripts/page.js --date 1988-03-21 --time 08:15 --tz Europe/Amsterdam --place "Amsterdam" --out bodygraph.html
```

Writes a single, self-contained HTML page that calculates the chart and assembles the bodygraph in an
animation when opened, with tap-to-explain, the reading, the birth-time check and Save as image. It works
offline; address search on the page needs internet. Give the person the file, or publish it with the host's
artifact or page tool if there is one. Headlines use GT Super and text uses Aeonik where those fonts are
installed; otherwise the free look-alikes Fraunces and Geist built into the page.

## Accuracy

Planet positions match Swiss Ephemeris (NASA JPL DE431), the reference most Human Design software uses, to
within one arcsecond. In a test of 10,000 random births, 9,998 charts had identical gates and lines; the
other 2 differed by one line of the Design Moon. Chart rules follow Jovian Archive and are checked against
published charts. Details: `references/accuracy.md`.
