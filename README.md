# Strip Reader

A phone-based PWA for photographing lateral-flow test strips in a
standardized way and quantifying the control/test line intensity into a
number. Everything — camera capture, image analysis, and storage — runs
entirely client-side in the browser. No backend, no build step, no
dependencies.

Live app: **https://rara097.github.io/strip-reader/**

For a formal, printable operator procedure (light-box + flash workflow,
quality checks, data handling), see **[SOP.md](SOP.md)**.

## Using it on your phone

1. Open the live URL above in Safari (iPhone) or Chrome (Android).
2. Add it to your home screen:
   - **iPhone**: Share button → "Add to Home Screen"
   - **Android**: ⋮ menu → "Install app"
3. Launch it from the home screen icon.

The app has a service worker that caches itself on first load, so after
that first visit it works **fully offline** — no computer, server, or
internet connection needed. Reopen it online occasionally so it can pick
up app updates.

## How it works

1. **Patient ID** — enter an identifier for the reading.
2. **Capture** — a dashed guide box overlays the live camera view. Align
   the strip's result window inside it and tap Capture. The **standardization
   light source should be a light-box with its own fixed internal light**
   (see [SOP.md](SOP.md) §4.1) — not the phone flash. Phone flash/torch
   control is only a supplementary bonus where the platform allows it (some
   Android/Chrome devices); the app tries to auto-enable it as extra fill
   light, but **iOS Safari blocks web apps from controlling the flash
   entirely** (an Apple platform restriction, not a bug), so on iPhone the
   button never appears. Don't rely on phone flash for standardization
   across devices — brightness, position, and color temperature vary by
   phone model. The guide box position is mapped back through the video's
   scaling math so the same region is cropped from the full-resolution
   photo regardless of screen size — this is what keeps captures
   standardized between readings.
3. **Select result window** — drag a tight box around the two lines
   (control + test). Your last selection is remembered as the starting
   point for the next capture.
4. **Analyze** — the app converts the selected region to a per-row
   darkness profile (`255 - luminance`), finds the two strongest peaks
   above the image's own background level, and reports:
   - Control line intensity (peak area)
   - Test line intensity (peak area)
   - T/C ratio
   Toggle "Top line = Control" / "Bottom line = Control" depending on
   your strip's layout.
5. **Save** — writes the patient ID, timestamp, both intensities, ratio,
   baseline, the crop box, the cropped result-window image, and the full
   standardized photo to the browser's local database (IndexedDB), plus a
   reserved `concentration` field for later calibration.

## History & export

The History screen lists all saved readings, filterable by patient ID:

- **Export CSV / Export JSON** — numeric data only (patient ID,
  timestamps, line intensities, ratio).
- **Photo** (per reading) — downloads that reading's full strip photo as
  a `.jpg`.
- **Download All Photos** — bundles every saved photo into a single
  `.zip` (built with a small dependency-free zip writer in
  [`js/zip.js`](js/zip.js), no external libraries).
- **Delete** — removes a reading permanently.

## Where data is stored

All readings and photos live in the browser's IndexedDB, scoped to this
app's origin on your phone. Nothing is uploaded anywhere. This means:

- Data is **not** visible in your phone's Photos or Files app — only
  through this app's History screen.
- It is **not backed up** automatically. Clearing that browser's site
  data, uninstalling the home-screen app, or using a private/incognito
  tab will erase it. Use the export buttons above to get data off the
  phone.
- Each browser (Safari vs. Chrome) and each device has its own separate
  store — there is no sync between them.

## Calibration: from relative signal to concentration

Today the intensity numbers are a **consistent relative proxy** — good
for comparing a line against its own control line or tracking change over
time — not yet a calibrated concentration (e.g. ng/mL). Producing a true
quantitative value requires a **calibration curve**: run strips of known
concentration, read their signal, fit signal → concentration (a
4-parameter logistic / 4PL is the standard model for immunoassays), then
invert the curve for unknown samples.

**You can test and store patient samples now and calibrate later.** Every
saved reading persists its raw signal (`ratio`, `testArea`, `controlArea`,
`baseline`), the exact crop box (`roiRect`), the full photo, and a
`schemaVersion`. Because the raw signal is stored, a calibration curve
built later can be **applied retroactively** to every sample already in
the database — no re-testing needed. The stored photo is a further safety
net: if the analysis algorithm improves, signal can be re-derived from the
original image. Each reading also carries a `concentration` field
(currently `null`) reserved for the calibrated value.

Calibrate on the **T/C ratio**, not raw test-line intensity: because both
lines are captured in the same frame, their ratio cancels most lighting
and auto-exposure variation, which is the main threat to reproducibility
on a phone web camera (browsers auto-adjust exposure/white-balance, and
the APIs to lock them are limited — especially on iOS Safari).

**Caveat for retroactive calibration:** it assumes capture conditions were
reasonably consistent between the patient-sample session and the later
standards session — same device, similar lighting, ideally the same strip
lot. When you run standards, shoot them on the same phone and consider
including known controls alongside patient batches to check for drift. A
fixed white/gray reference patch in every shot (to normalize against)
would further improve absolute accuracy.

Realistically, ratio-based **semi-quantitative** concentration is
achievable; lab-reader-grade absolute quantitation is limited by
phone-camera auto-adjustment on the web.

## Local development

No build step or dependencies are required — it's plain HTML/CSS/JS
loaded as ES modules. Camera access requires a secure context (HTTPS or
`localhost`), so you need *some* local server, e.g.:

```sh
npx serve .
```

Then open the printed `localhost` URL. A `.claude/launch.json` config is
already set up if you're using Claude Code's browser preview.

### File structure

```
index.html          Single-page app shell (all screens)
css/style.css        Styling
js/app.js            Screen navigation, state, wiring
js/camera.js         getUserMedia, torch control, guide-box → video-pixel mapping
js/analysis.js       Row-profile extraction, peak detection, T/C computation
js/db.js             IndexedDB wrapper (readings store)
js/zip.js            Minimal dependency-free ZIP writer for photo export
manifest.json        PWA manifest
sw.js                Service worker (offline app-shell caching)
icons/icon.svg        App icon
```

## Deployment

The live site is served by GitHub Pages from the `main` branch root of
this repo. Any push to `main` redeploys automatically — GitHub typically
takes 30–60 seconds to rebuild.
