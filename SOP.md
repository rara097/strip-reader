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
- **Light-box** with its own fixed, internal light source (see Section 4.1).
  This — not the phone flash — is the standardization light source.
- Prepared, developed test strips ready to read.
- Marker for labeling strips with the Patient ID.

### 4.1 Why the box needs its own light

Phone flash/torch **cannot** be used as the standardization light source:
- **iPhone (Safari) cannot control the flash from a web app at all** — this is
  an Apple platform restriction with no workaround.
- Even on Android devices where it works, flash position, brightness, and
  color temperature vary by phone model, which would make readings
  inconsistent across devices and undermine any future calibration curve.
- Phones may be swapped or replaced over the life of this program; a fixed
  box light keeps the standard independent of which phone is in use.

The light-box must therefore have its own **fixed-brightness, USB-powered
(not battery) LED light**, ideally diffused (e.g. a diffuser panel or a
white interior the light bounces off) rather than a bare point source aimed
directly at the strip, to avoid glare/hotspots on the glossy cassette
window. Use a neutral/daylight-white LED (roughly 5000–6500K), never a
dimmable or color-changing one. Once installed, this light stays on the
same fixed setting for the life of the box — do not adjust brightness
between sessions.

If your box does not yet have this, do not use it for readings intended to
support a calibration curve until it does.

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
- Confirm the box's internal light turns on reliably and at a fixed,
  unadjustable brightness (Section 4.1).
- Confirm the phone seats in the **same fixed position** every time (same
  distance and angle to the strip). Mark the phone and strip positions if the
  box does not fix them mechanically.

## 6. Standardization requirements (read before every session)

These conditions **must** be the same for every capture. Do not vary them
between patient samples, and keep them identical when standards are later run
for calibration.

1. **Light-box:** The strip is imaged **inside the closed light-box, with the
   box's internal light on**, so no ambient/room light reaches it and
   illumination is always the same fixed source. Never capture in open room
   light, and never capture with the box light off.
2. **Phone flash: leave at its default, do not rely on it.** The on-screen
   "Phone Flash" button is a supplementary bonus where the platform allows
   it — it is **not** the standardization light source and does not appear
   at all on iPhone (Section 6.2). Do not toggle it between samples in the
   same batch; whatever state it's in when a batch starts, keep it that way
   for the whole batch.
3. **Fixed geometry:** Same phone-to-strip distance and angle every time (fixed
   by the box or by marked positions). Approx. 10 cm if not mechanically fixed.
4. **Alignment:** The strip's result window is centered inside the on-screen
   dashed guide box.
5. **Same device:** Use the same designated phone for a given study/lot.

### 6.2 About the "Phone Flash" button
On supported Android devices, the app will try to turn the phone flash on
automatically as extra fill light when the camera opens. **On iPhone
(Safari), this button never appears — this is expected.** Apple's WebKit
does not allow web apps to control the flash at all; there is no setting or
fix for this. It does not affect standardization, because the box's
internal light (Section 4.1) is the actual fixed light source, not the
phone flash.

### 6.3 Glare exception
If the result window shows a bright reflection/hotspot on the glossy
cassette, the line can be washed out. Reposition the strip or adjust the
diffuser; if the box light source itself is the cause, that's a hardware
issue with the box (Section 4.1) to fix before continuing, not something to
work around by toggling the phone flash.

## 7. Procedure (per sample)

1. **Label** the strip with its Patient ID.
2. Open the app; on the **New Reading** screen, enter the **Patient ID** exactly
   as labeled. Tap **Start Capture**.
3. Place the strip in the light-box in the fixed position, confirm the box's
   internal light is on, and **close the box.**
4. Confirm the strip's result window sits inside the dashed guide box.
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
| No "Phone Flash" button appears | Expected on iPhone (Safari) — WebKit blocks web-app flash control entirely | No action needed; the box's internal light is the actual standardization source (Section 4.1). |
| Glare on result window | Box light reflecting off cassette | Reposition strip; adjust/add diffuser; fix box light hardware if the hotspot persists (Section 6.3). |
| Only one peak / test line missing | Faint line, wrong ROI, or true negative | Re-check ROI box is tight; recapture; a genuinely absent test line may be a real result. |
| Control line missing | Invalid assay or bad capture | Recapture; if still absent, treat as failed test. |
| App looks outdated after an update | Cached old version | Open the app once while online to let it update. |

## 12. Revision history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | ________ | ________ | Initial release. |
