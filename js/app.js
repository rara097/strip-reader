import { addReading, getAllReadings, deleteReading } from "./db.js";
import { startCamera, stopCamera, getTrack, torchSupported, setTorch, captureFrame, guideBoxToVideoRect } from "./camera.js";
import { cropCanvas, computeReading, drawProfileChart } from "./analysis.js";
import { buildZip } from "./zip.js";

const ROI_TEMPLATE_KEY = "strip-reader.roiTemplate";

const els = {
  screens: Object.fromEntries(
    ["patient", "camera", "roi", "result", "history"].map((n) => [n, document.getElementById(`screen-${n}`)])
  ),
  historyNav: document.getElementById("btn-history-nav"),
  patientIdInput: document.getElementById("input-patient-id"),
  startCaptureBtn: document.getElementById("btn-start-capture"),
  video: document.getElementById("video"),
  cameraWrap: document.getElementById("camera-wrap"),
  guideBox: document.getElementById("guide-box"),
  cameraError: document.getElementById("camera-error"),
  torchBtn: document.getElementById("btn-torch"),
  captureBtn: document.getElementById("btn-capture"),
  cancelCameraBtn: document.getElementById("btn-cancel-camera"),
  roiWrap: document.getElementById("roi-wrap"),
  roiCanvas: document.getElementById("roi-canvas"),
  roiSelection: document.getElementById("roi-selection"),
  retakeBtn: document.getElementById("btn-retake"),
  analyzeBtn: document.getElementById("btn-analyze"),
  resultRoiImg: document.getElementById("result-roi-img"),
  profileChart: document.getElementById("profile-chart"),
  controlPosRadios: document.getElementsByName("control-pos"),
  valControl: document.getElementById("val-control"),
  valTest: document.getElementById("val-test"),
  valRatio: document.getElementById("val-ratio"),
  discardBtn: document.getElementById("btn-discard"),
  saveBtn: document.getElementById("btn-save"),
  filterPatientId: document.getElementById("filter-patient-id"),
  exportCsvBtn: document.getElementById("btn-export-csv"),
  exportJsonBtn: document.getElementById("btn-export-json"),
  exportPhotosBtn: document.getElementById("btn-export-photos"),
  historyList: document.getElementById("history-list"),
  backHomeBtn: document.getElementById("btn-back-home"),
};

const state = {
  patientId: "",
  stream: null,
  track: null,
  torchOn: false,
  fullCanvas: null,     // guide-cropped photo, standardized frame
  roiRect: null,         // {x,y,w,h} in fullCanvas pixel coords
  roiCanvas: null,       // cropped result-window canvas
  reading: null,
};

function showScreen(name) {
  Object.values(els.screens).forEach((s) => s.classList.remove("active"));
  els.screens[name].classList.add("active");
  if (name !== "camera" && state.stream) {
    stopCamera(state.stream);
    state.stream = null;
    state.track = null;
  }
}

// --- Patient screen ---

els.patientIdInput.addEventListener("input", () => {
  els.startCaptureBtn.disabled = !els.patientIdInput.value.trim();
});

els.startCaptureBtn.addEventListener("click", async () => {
  state.patientId = els.patientIdInput.value.trim();
  showScreen("camera");
  await openCamera();
});

els.historyNav.addEventListener("click", () => {
  showScreen("history");
  renderHistory();
});

els.backHomeBtn.addEventListener("click", () => {
  els.patientIdInput.value = "";
  els.startCaptureBtn.disabled = true;
  showScreen("patient");
});

// --- Camera screen ---

async function openCamera() {
  els.cameraError.hidden = true;
  els.torchBtn.hidden = true;
  try {
    state.stream = await startCamera(els.video);
    state.track = getTrack(state.stream);
    if (torchSupported(state.track)) {
      els.torchBtn.hidden = false;
      els.torchBtn.textContent = "Flash: Off";
      state.torchOn = false;
    }
  } catch (err) {
    els.cameraError.hidden = false;
    els.cameraError.textContent =
      "Could not access camera: " + (err.message || err.name) +
      ". Check camera permissions for this site.";
  }
}

els.torchBtn.addEventListener("click", async () => {
  if (!state.track) return;
  try {
    state.torchOn = !state.torchOn;
    await setTorch(state.track, state.torchOn);
    els.torchBtn.textContent = state.torchOn ? "Flash: On" : "Flash: Off";
  } catch {
    els.torchBtn.hidden = true;
  }
});

els.cancelCameraBtn.addEventListener("click", () => {
  showScreen("patient");
});

els.captureBtn.addEventListener("click", () => {
  if (!els.video.videoWidth) return;
  const frame = captureFrame(els.video);
  const rect = guideBoxToVideoRect(els.video, els.cameraWrap, els.guideBox);
  state.fullCanvas = cropCanvas(frame, rect);
  showScreen("roi");
  loadRoiScreen();
});

// --- ROI selection screen ---

function loadRoiScreen() {
  const canvas = els.roiCanvas;
  canvas.width = state.fullCanvas.width;
  canvas.height = state.fullCanvas.height;
  canvas.getContext("2d").drawImage(state.fullCanvas, 0, 0);

  const saved = JSON.parse(localStorage.getItem(ROI_TEMPLATE_KEY) || "null");
  if (saved && saved.w < canvas.width && saved.h < canvas.height) {
    setSelectionFromCanvasRect(saved);
  } else {
    setSelectionFromCanvasRect({
      x: canvas.width * 0.25,
      y: canvas.height * 0.4,
      w: canvas.width * 0.5,
      h: canvas.height * 0.2,
    });
  }
}

function canvasRectToDisplayRect(rect) {
  const displayScale = els.roiCanvas.getBoundingClientRect().width / els.roiCanvas.width;
  return {
    left: rect.x * displayScale,
    top: rect.y * displayScale,
    width: rect.w * displayScale,
    height: rect.h * displayScale,
  };
}

function setSelectionFromCanvasRect(rect) {
  state.roiRect = rect;
  const d = canvasRectToDisplayRect(rect);
  Object.assign(els.roiSelection.style, {
    left: d.left + "px",
    top: d.top + "px",
    width: d.width + "px",
    height: d.height + "px",
  });
  els.roiSelection.hidden = false;
}

let dragStart = null;
els.roiWrap.addEventListener("pointerdown", (e) => {
  const rect = els.roiWrap.getBoundingClientRect();
  dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  els.roiWrap.setPointerCapture(e.pointerId);
});
els.roiWrap.addEventListener("pointermove", (e) => {
  if (!dragStart) return;
  const rect = els.roiWrap.getBoundingClientRect();
  const cur = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  const left = Math.min(dragStart.x, cur.x);
  const top = Math.min(dragStart.y, cur.y);
  const width = Math.abs(cur.x - dragStart.x);
  const height = Math.abs(cur.y - dragStart.y);
  Object.assign(els.roiSelection.style, {
    left: left + "px", top: top + "px", width: width + "px", height: height + "px",
  });
  els.roiSelection.hidden = false;

  const scale = els.roiCanvas.width / rect.width;
  state.roiRect = { x: left * scale, y: top * scale, w: width * scale, h: height * scale };
});
els.roiWrap.addEventListener("pointerup", () => { dragStart = null; });

els.retakeBtn.addEventListener("click", () => {
  showScreen("camera");
  openCamera();
});

els.analyzeBtn.addEventListener("click", () => {
  if (!state.roiRect || state.roiRect.w < 4 || state.roiRect.h < 4) return;
  localStorage.setItem(ROI_TEMPLATE_KEY, JSON.stringify(state.roiRect));
  state.roiCanvas = cropCanvas(state.fullCanvas, state.roiRect);
  showScreen("result");
  runAnalysis();
});

// --- Result screen ---

function getControlIsTop() {
  return Array.from(els.controlPosRadios).find((r) => r.checked).value === "top";
}

function runAnalysis() {
  state.reading = computeReading(state.roiCanvas, getControlIsTop());
  els.resultRoiImg.src = state.roiCanvas.toDataURL("image/png");
  renderResult();
}

Array.from(els.controlPosRadios).forEach((r) => r.addEventListener("change", runAnalysis));

function fmt(n) {
  return n == null ? "–" : n.toFixed(1);
}

function renderResult() {
  const r = state.reading;
  drawProfileChart(els.profileChart, r);
  els.valControl.textContent = r.control ? fmt(r.control.area) : "not detected";
  els.valTest.textContent = r.test ? fmt(r.test.area) : "not detected";
  els.valRatio.textContent = r.ratio != null ? r.ratio.toFixed(3) : "–";
}

els.discardBtn.addEventListener("click", () => {
  showScreen("camera");
  openCamera();
});

els.saveBtn.addEventListener("click", async () => {
  const roiBlob = await new Promise((res) => state.roiCanvas.toBlob(res, "image/png"));
  const fullBlob = await new Promise((res) => state.fullCanvas.toBlob(res, "image/jpeg", 0.9));
  const r = state.reading;
  await addReading({
    // schemaVersion lets a future calibration pass know which fields/units a
    // stored reading used, so old samples can be recomputed deterministically.
    schemaVersion: 1,
    patientId: state.patientId,
    timestamp: Date.now(),
    controlIsTop: getControlIsTop(),
    controlArea: r.control ? r.control.area : null,
    testArea: r.test ? r.test.area : null,
    controlHeight: r.control ? r.control.height : null,
    testHeight: r.test ? r.test.height : null,
    ratio: r.ratio,
    baseline: r.baseline,
    peakCount: r.peakCount,
    // exact crop box in fullImage pixel coords, so the ROI can be re-analyzed
    // from the stored full photo without guessing where the lines were.
    roiRect: state.roiRect,
    // concentration is filled in later, once a calibration curve exists.
    concentration: null,
    roiImage: roiBlob,
    fullImage: fullBlob,
  });
  showScreen("history");
  renderHistory();
});

// --- History screen ---

els.filterPatientId.addEventListener("input", () => renderHistory());
els.exportCsvBtn.addEventListener("click", exportCsv);
els.exportJsonBtn.addEventListener("click", exportJson);
els.exportPhotosBtn.addEventListener("click", exportPhotosZip);

function photoFileName(r) {
  const stamp = new Date(r.timestamp).toISOString().replace(/[:.]/g, "-");
  const pid = r.patientId.replace(/[^a-z0-9_-]/gi, "_");
  return `patient-${pid}_${stamp}.jpg`;
}

async function exportPhotosZip() {
  const all = await getAllReadings();
  if (!all.length) return;
  els.exportPhotosBtn.disabled = true;
  els.exportPhotosBtn.textContent = "Zipping…";
  try {
    const files = all.map((r) => ({ name: photoFileName(r), blob: r.fullImage, date: new Date(r.timestamp) }));
    const zip = await buildZip(files);
    downloadBlob(zip, "strip-photos.zip");
  } finally {
    els.exportPhotosBtn.disabled = false;
    els.exportPhotosBtn.textContent = "Download All Photos";
  }
}

async function renderHistory() {
  const filter = els.filterPatientId.value.trim().toLowerCase();
  const all = await getAllReadings();
  const filtered = filter ? all.filter((r) => r.patientId.toLowerCase().includes(filter)) : all;

  els.historyList.innerHTML = "";
  if (!filtered.length) {
    els.historyList.innerHTML = '<div class="empty-state">No readings yet.</div>';
    return;
  }

  for (const r of filtered) {
    const item = document.createElement("div");
    item.className = "history-item";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(r.roiImage);

    const meta = document.createElement("div");
    meta.className = "meta";
    const date = new Date(r.timestamp).toLocaleString();
    meta.innerHTML = `
      <div class="pid">Patient ${escapeHtml(r.patientId)}</div>
      <div class="muted">${date}</div>
      <div>T ${fmt(r.testArea)} / C ${fmt(r.controlArea)} — ratio ${r.ratio != null ? r.ratio.toFixed(3) : "–"}</div>
    `;

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const photoBtn = document.createElement("button");
    photoBtn.textContent = "Photo";
    photoBtn.className = "photo-btn";
    photoBtn.addEventListener("click", () => downloadBlob(r.fullImage, photoFileName(r)));

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", async () => {
      await deleteReading(r.id);
      renderHistory();
    });

    actions.append(photoBtn, delBtn);
    item.append(img, meta, actions);
    els.historyList.appendChild(item);
  }
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

async function exportCsv() {
  const all = await getAllReadings();
  const header = ["id", "patientId", "timestamp", "isoDate", "controlArea", "testArea", "controlHeight", "testHeight", "ratio", "baseline", "concentration"];
  const rows = all.map((r) => [
    r.id, r.patientId, r.timestamp, new Date(r.timestamp).toISOString(),
    r.controlArea, r.testArea, r.controlHeight, r.testHeight, r.ratio,
    r.baseline, r.concentration,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  downloadBlob(new Blob([csv], { type: "text/csv" }), "strip-readings.csv");
}

function csvEscape(v) {
  if (v == null) return "";
  const s = String(v);
  return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function exportJson() {
  const all = await getAllReadings();
  const plain = all.map(({ roiImage, fullImage, ...rest }) => rest);
  downloadBlob(new Blob([JSON.stringify(plain, null, 2)], { type: "application/json" }), "strip-readings.json");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
