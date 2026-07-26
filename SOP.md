# Standard Operating Procedure — Strip Reader

**Document:** SOP-SR-001
**Title:** Standardized capture and reading of lateral-flow test strips using the Strip Reader app
**Version:** 1.0
**Effective date:** _____________
**Prepared by:** _____________
**Approved by:** _____________

---

## 1. Purpose

To define a standardized, repeatable procedure for photographing lateral-flow
test strips and recording a quantitative line-intensity reading, so that images
and readings are consistent across operators, sessions, and devices. Consistency
at capture is what makes the readings comparable over time and suitable for a
future calibration curve.

## 2. Scope

Applies to all personnel capturing and recording strip readings with the Strip
Reader app (`https://rara097.github.io/strip-reader/`) using the designated
light-box and phone. Covers sample capture, on-device analysis, and data
handling. Does **not** cover assay preparation or clinical interpretation.

## 3. Responsibilities

- **Operator:** Follows this SOP for every reading; performs quality checks;
  flags failures.
- **Supervisor:** Ensures devices are set up per Section 5; reviews exported
  data; controls document revisions.

## 4. Materials & equipment

- Designated smartphone with the Strip Reader app installed to the home screen
  (see Section 5.1).
- **Light-box** — a dark enclosure that blocks outside/ambient light so the
  phone flash is the only light reaching the strip (see Section 4.1).
- Prepared, developed test strips ready to read.
- Marker for labeling strips with the Patient ID.

### 4.1 Standardization light source: the phone flash

The **phone flash/torch is the standardization light source.** The app turns
it on automatically when the camera opens (Section 6.2). The light-box's job
is to block ambient/room light so the flash is the *only* light reaching the
strip on every capture — without it, changes in room lighting would bleed
into the reading.

Keep the same designated phone for a given study/lot (Section 5): flash
brightness, position, and color temperature vary by phone model, so mixing
phones would make readings inconsistent with each other.

## 5. One-time setup

### 5.1 Install the app (once per phone)
1. Open `https://rara097.github.io/strip-reader/` in the phone browser
   (Safari on iPhone, Chrome on Android) **while online**.
2. Add to home screen:
   - iPhone: Share → **Add to Home Screen**.
   - Android: ⋮ menu → **Install app**.
3. Open the app once from the home-screen icon. It now works offline.
4. Grant camera permission when prompted (required).

### 5.2 Verify the standardized rig
- Confirm the light-box is clean and undamaged and blocks outside light when
  closed.
- Confirm the phone's flash reliably turns on when the camera screen opens
  (Section 6.2).
- Confirm the phone seats in the **same fixed position** every time (same
  distance and angle to the strip). Mark the phone and strip positions if the
  box does not fix them mechanically.
- Confirm the whole strip (including its result window) fits comfortably
  inside the on-screen dashed guide box without the picture looking like a
  tight, blown-up close-up. If it doesn't, see Section 5.3 (lens).

### 5.3 Lens selection
At the short, fixed distance most light-boxes hold the phone, a phone's
**standard/main camera lens** often can't fit the whole strip in frame — the
picture looks "zoomed in" even though nothing is being cropped in software,
because the lens's native field of view is simply too narrow at that
distance. On phones with a separate **ultra-wide lens** (most iPhones since
the 11 Pro, and many recent Android phones), the app selects it
automatically and shows **"Lens: Ultra-Wide"** on the camera screen.

- If the picture still looks too tight, or the "Lens" button doesn't appear
  (older phones without an ultra-wide lens), physically increase the
  phone-to-strip distance if the box allows it.
- Tapping the **Lens** button switches between "Ultra-Wide" and "Standard."
  Whichever you land on for a given phone/box combination, **keep it fixed
  for the life of that study** — switching lenses changes the optical
  distortion and field of view, which is exactly the kind of inconsistency
  Section 6 exists to prevent. The app remembers your choice automatically
  between sessions, but confirm it hasn't changed if the app is reinstalled
  or a different phone is used.

## 6. Standardization requirements (read before every session)

These conditions **must** be the same for every capture. Do not vary them
between patient samples, and keep them identical when standards are later run
for calibration.

1. **Light-box:** The strip is imaged **inside the closed light-box, with the
   phone flash on**, so no ambient/room light reaches it and illumination is
   always the same fixed source. Never capture in open room light, and never
   capture with the flash off.
2. **Flash ON:** The on-screen button should read **"Phone Flash: On."** The
   app turns it on automatically when the camera opens — confirm it before
   every capture (Section 6.2). Do not toggle it off between samples in the
   same batch; if glare requires turning it off (Section 6.3), keep it off
   for the whole batch, never mixed.
3. **Fixed geometry:** Same phone-to-strip distance and angle every time (fixed
   by the box or by marked positions). Approx. 10 cm if not mechanically fixed.
4. **Alignment:** The strip's result window is centered inside the on-screen
   dashed guide box.
5. **Same device:** Use the same designated phone for a given study/lot.
6. **Same lens:** Whichever lens ("Lens: Ultra-Wide" or "Lens: Standard") is
   selected for a phone/box combination (Section 5.3), keep it fixed for the
   whole study. Do not switch lenses between samples in a comparison set.

### 6.2 Confirming the flash
When you tap **Start Capture**, the flash should switch on automatically and
the button should show **"Phone Flash: On."** If it doesn't turn on, tap the
button to enable it manually before capturing. If the button doesn't appear
at all, back out and reopen the camera screen, and check that camera/flash
permission is granted for the app.

### 6.3 Glare exception
If the result window shows a bright reflection/hotspot from the flash on the
glossy cassette, the line can be washed out. Reposition slightly, or tap the
flash button to **Phone Flash: Off** — but if you do, keep it off for **all**
samples in that batch and note it. Never mix flash-on and flash-off within a
comparison set.

## 7. Procedure (per sample)

1. **Label** the strip with its Patient ID.
2. Open the app; on the **New Reading** screen, enter the **Patient ID** exactly
   as labeled. Tap **Start Capture**.
3. Place the strip in the light-box in the fixed position and **close the box.**
4. Confirm **Phone Flash: On** and that the strip's result window sits inside
   the dashed guide box.
5. Hold steady and tap **Capture.**
6. On **Select Result Window**, drag a tight box around the two lines (control +
   test). The previous selection is reused as a starting point — adjust only if
   needed. Tap **Analyze.**
7. On the **Result** screen:
   - Set the **control-line position** toggle ("Top line = Control" / "Bottom
     line = Control") to match your strip layout.
   - Perform the quality checks in Section 8.
8. If the reading passes QC, tap **Save Reading.** If it fails, tap **Discard**
   (or **Retake Photo**) and repeat from step 3.
9. Repeat for each sample.

## 8. Quality checks (before saving)

Reject and recapture if any of these fail:

- [ ] **Control line detected.** The control line (peak "C" on the profile
      chart) is present. If the control line is absent, the assay/read is
      invalid — recapture; if still absent, treat the strip as a failed test.
- [ ] **Both peaks located correctly.** The C and T markers on the profile chart
      sit on the actual lines, not on noise or edges.
- [ ] **No glare/hotspot** over the result window (Section 6.3).
- [ ] **Strip in focus** and centered in the guide box.
- [ ] **Patient ID correct.**

## 9. Data handling & backup

- All readings and photos are stored **locally on the phone only** (browser
  database). They are **not** in the phone's Photos/Files app and are **not**
  backed up automatically.
- **Export regularly** (recommended at the end of each session) from the
  **History** screen:
  - **Export CSV** — numeric readings (IDs, timestamps, line intensities, ratio,
    baseline, concentration).
  - **Export JSON** — same data in structured form.
  - **Download All Photos** — all strip photos as a single `.zip`.
- Transfer exports to the designated secure storage per your data-management
  policy. Do not rely on the phone as the only copy.
- **Do not** clear browser data, uninstall the app, or use private/incognito
  mode on the designated phone — any of these erases all stored readings.

## 10. Interpreting the numbers (current limitation)

The app currently reports **relative** line intensities and a **T/C ratio**, in
arbitrary units — useful for comparing the test line against its control and for
tracking change over time, but **not yet a calibrated concentration.** The
`concentration` field remains blank until a calibration curve is established.
Because every reading stores its raw signal and photo, a calibration curve built
later can be applied **retroactively** to samples already recorded — provided the
capture conditions in this SOP were followed consistently. Do not report
intensity numbers as concentrations until calibration is validated.

## 11. Troubleshooting

| Symptom | Likely cause | Action |
|---|---|---|
| "Could not access camera" | Permission denied | Grant camera permission for the site in browser settings; reopen. |
| Flash won't turn on / "Phone Flash" button missing | Permission not yet granted, or a transient capability delay | Tap the flash button to retry manually; reopen the camera screen; check camera permission is granted for the app. |
| Picture looks zoomed in / strip doesn't fit in the guide box | Standard lens's field of view too narrow at the box's fixed distance | Confirm "Lens: Ultra-Wide" is selected (Section 5.3); tap **Lens** to switch if needed, then keep that choice fixed for the study. |
| No "Lens" button appears | Phone has no separate ultra-wide camera (older/single-lens phone) | Increase phone-to-strip distance if the box allows it; otherwise this is a hardware limit of that phone. |
| Glare on result window | Flash reflecting off cassette | Reposition; if needed disable flash for the whole batch (Section 6.3). |
| Only one peak / test line missing | Faint line, wrong ROI, or true negative | Re-check ROI box is tight; recapture; a genuinely absent test line may be a real result. |
| Control line missing | Invalid assay or bad capture | Recapture; if still absent, treat as failed test. |
| App looks outdated after an update | Cached old version | Open the app once while online to let it update. |

## 12. Revision history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | ________ | ________ | Initial release. |
