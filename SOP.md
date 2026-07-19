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
- **Light-box (black box)** for controlled, ambient-light-free imaging.
- Phone flash/torch (used as the standard light source — see Section 6).
- Prepared, developed test strips ready to read.
- Marker for labeling strips with the Patient ID.

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
- Confirm the phone seats in the **same fixed position** every time (same
  distance and angle to the strip). Mark the phone and strip positions if the
  box does not fix them mechanically.
- Confirm the flash turns on when the camera screen opens (Section 6.2).

## 6. Standardization requirements (read before every session)

These conditions **must** be the same for every capture. Do not vary them
between patient samples, and keep them identical when standards are later run
for calibration.

1. **Light-box:** The strip is imaged **inside the closed light-box** so no
   ambient/room light reaches it. Never capture in open room light.
2. **Flash ON:** The phone flash is the single, consistent light source. The app
   **turns the flash on automatically** when the camera opens; the on-screen
   button should read **"Flash: On."** Do not turn it off unless glare requires
   it (see 6.3).
3. **Fixed geometry:** Same phone-to-strip distance and angle every time (fixed
   by the box or by marked positions). Approx. 10 cm if not mechanically fixed.
4. **Alignment:** The strip's result window is centered inside the on-screen
   dashed guide box.
5. **Same device:** Use the same designated phone for a given study/lot.

### 6.2 Confirming the flash
When you tap **Start Capture**, the flash should switch on automatically and the
button should show **"Flash: On."** If the button shows "Flash: Off" or is
missing, the device/browser does not support app-controlled torch (common on
iPhone/Safari). In that case use the light-box's own illumination if provided,
keep it identical for every shot, and record this in the run notes.

### 6.3 Glare exception
If the result window shows a bright reflection/hotspot from the flash on the
glossy cassette, the line can be washed out. Reposition slightly, or tap the
flash button to **Flash: Off** — but if you do, keep it off for **all** samples
in that batch and note it. Never mix flash-on and flash-off within a comparison
set.

## 7. Procedure (per sample)

1. **Label** the strip with its Patient ID.
2. Open the app; on the **New Reading** screen, enter the **Patient ID** exactly
   as labeled. Tap **Start Capture**.
3. Place the strip in the light-box in the fixed position and **close the box.**
4. Confirm **Flash: On** and that the strip's result window sits inside the
   dashed guide box.
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
| No flash button / "Flash: Off" won't turn on | Browser/device can't control torch (e.g. iOS Safari) | Use the light-box illumination consistently; note in run log. |
| Glare on result window | Flash reflecting off cassette | Reposition; if needed disable flash for the whole batch (Section 6.3). |
| Only one peak / test line missing | Faint line, wrong ROI, or true negative | Re-check ROI box is tight; recapture; a genuinely absent test line may be a real result. |
| Control line missing | Invalid assay or bad capture | Recapture; if still absent, treat as failed test. |
| App looks outdated after an update | Cached old version | Open the app once while online to let it update. |

## 12. Revision history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | ________ | ________ | Initial release. |
