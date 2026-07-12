export function cropCanvas(sourceCanvas, rect) {
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(rect.w));
  out.height = Math.max(1, Math.round(rect.h));
  out.getContext("2d").drawImage(
    sourceCanvas,
    rect.x, rect.y, rect.w, rect.h,
    0, 0, out.width, out.height
  );
  return out;
}

// Darkness (255 - luminance) is used instead of a specific color channel so the
// same code works regardless of whether the line dye is red, blue, or gold.
export function computeRowProfile(canvas) {
  const { width, height } = canvas;
  const img = canvas.getContext("2d").getImageData(0, 0, width, height).data;
  const profile = new Float64Array(height);
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const luminance = 0.299 * img[idx] + 0.587 * img[idx + 1] + 0.114 * img[idx + 2];
      sum += 255 - luminance;
    }
    profile[y] = sum / width;
  }
  return profile;
}

function median(arr) {
  const s = Array.from(arr).sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function smooth(profile) {
  return profile.map((v, i, arr) => {
    const a = arr[Math.max(0, i - 1)];
    const b = arr[Math.min(arr.length - 1, i + 1)];
    return (a + v + b) / 3;
  });
}

// Finds up to two local-maxima peaks (control + test lines) above the
// per-image median background, so exposure differences between photos
// are self-corrected rather than requiring a fixed global threshold.
export function findPeaks(profile) {
  const baseline = median(profile);
  const smoothed = smooth(profile);

  const candidates = [];
  for (let i = 1; i < smoothed.length - 1; i++) {
    if (smoothed[i] > smoothed[i - 1] && smoothed[i] >= smoothed[i + 1] && smoothed[i] > baseline) {
      candidates.push({ y: i, value: smoothed[i] });
    }
  }
  candidates.sort((a, b) => b.value - a.value);

  const picked = [];
  for (const c of candidates) {
    if (picked.every((p) => Math.abs(p.y - c.y) > Math.max(4, Math.round(profile.length * 0.03)))) {
      picked.push(c);
    }
    if (picked.length === 2) break;
  }
  picked.sort((a, b) => a.y - b.y);

  const win = Math.max(2, Math.round(profile.length * 0.02));
  const areaAround = (y) => {
    let sum = 0;
    for (let k = Math.max(0, y - win); k <= Math.min(profile.length - 1, y + win); k++) {
      sum += Math.max(0, profile[k] - baseline);
    }
    return sum;
  };

  return {
    baseline,
    smoothed,
    peaks: picked.map((p) => ({
      y: p.y,
      height: Math.max(0, p.value - baseline),
      area: areaAround(p.y),
    })),
  };
}

export function computeReading(roiCanvas, controlIsTop) {
  const profile = computeRowProfile(roiCanvas);
  const { baseline, smoothed, peaks } = findPeaks(profile);

  let control = null;
  let test = null;
  if (peaks.length === 2) {
    [control, test] = controlIsTop ? [peaks[0], peaks[1]] : [peaks[1], peaks[0]];
  } else if (peaks.length === 1) {
    control = peaks[0];
  }

  const ratio = control && test && control.area > 0 ? test.area / control.area : null;

  return { profile, smoothed, baseline, control, test, ratio, peakCount: peaks.length };
}

export function drawProfileChart(canvas, reading) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  const profile = reading.smoothed;
  const max = Math.max(...profile, reading.baseline) || 1;
  const toX = (y) => (y / (profile.length - 1)) * (width - 20) + 10;
  const toY = (v) => height - 10 - (v / max) * (height - 20);

  ctx.strokeStyle = "#475569";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, toY(reading.baseline));
  ctx.lineTo(width, toY(reading.baseline));
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  profile.forEach((v, y) => {
    const x = toX(y);
    const py = toY(v);
    if (y === 0) ctx.moveTo(x, py);
    else ctx.lineTo(x, py);
  });
  ctx.stroke();

  const markPeak = (peak, color, label) => {
    if (!peak) return;
    const x = toX(peak.y);
    const y = toY(profile[peak.y]);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "10px sans-serif";
    ctx.fillText(label, x + 6, y);
  };
  markPeak(reading.control, "#38bdf8", "C");
  markPeak(reading.test, "#f472b6", "T");
}
