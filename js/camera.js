// Match the portrait guide box's aspect ratio (see .camera-wrap in
// style.css) so object-fit:cover doesn't have to crop heavily to fill it.
const BASE_VIDEO_CONSTRAINTS = {
  aspectRatio: { ideal: 3 / 4 },
  width: { ideal: 1080 },
  height: { ideal: 1440 },
};

export async function listRearCameras() {
  if (!navigator.mediaDevices.enumerateDevices) return [];
  const devices = await navigator.mediaDevices.enumerateDevices();
  // Device labels are only populated once permission has been granted at
  // least once — callers must already hold an open stream before this
  // returns anything useful.
  return devices.filter((d) => d.kind === "videoinput" && /back|rear|environment/i.test(d.label));
}

function pickDeviceId(rearCams, lens) {
  if (!rearCams.length) return null;
  if (lens === "ultrawide") {
    const uw = rearCams.find((d) => /ultra.?wide/i.test(d.label));
    if (uw) return uw.deviceId;
  }
  const standard = rearCams.find((d) => /^back camera$/i.test(d.label.trim()));
  return (standard || rearCams[0]).deviceId;
}

// lens: "ultrawide" (default) or "wide". At the short, fixed distance a
// light-box holds the phone, the standard/main lens's native field of view
// is often too narrow to fit the whole strip in frame — which reads as the
// camera being "zoomed in" even though no software cropping is happening.
// The ultra-wide lens (a physically separate camera on most modern phones)
// gives a much wider field of view at the same distance. Not every device
// has one; this degrades gracefully to whatever "environment" camera the
// device offers when it doesn't.
export async function startCamera(videoEl, lens = "ultrawide") {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: "environment" }, ...BASE_VIDEO_CONSTRAINTS },
    audio: false,
  });

  try {
    const rearCams = await listRearCameras();
    const deviceId = pickDeviceId(rearCams, lens);
    const currentId = stream.getVideoTracks()[0].getSettings().deviceId;
    if (deviceId && deviceId !== currentId) {
      stream.getTracks().forEach((t) => t.stop());
      stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId }, ...BASE_VIDEO_CONSTRAINTS },
        audio: false,
      });
    }
  } catch {
    // Lens selection is a best-effort enhancement on top of the generic
    // environment-facing stream already open above; keep that on failure.
  }

  videoEl.srcObject = stream;
  await videoEl.play();
  await resetZoom(stream.getVideoTracks()[0]);
  return stream;
}

// Some multi-lens phones default a fresh track to a non-1x zoom (e.g. the
// "environment" logical camera picking a 2x crop). Reset to 1x where the
// device exposes zoom control, so field of view matches what's on screen.
async function resetZoom(track) {
  const caps = track.getCapabilities ? track.getCapabilities() : {};
  if (!caps.zoom) return;
  const min = caps.zoom.min ?? 1;
  const max = caps.zoom.max ?? 1;
  const target = Math.min(Math.max(1, min), max);
  try {
    await track.applyConstraints({ advanced: [{ zoom: target }] });
  } catch {
    // capability reported but the device rejected the constraint; not fatal
  }
}

export function stopCamera(stream) {
  if (stream) stream.getTracks().forEach((t) => t.stop());
}

export function getTrack(stream) {
  return stream.getVideoTracks()[0];
}

export function torchSupported(track) {
  const caps = track.getCapabilities ? track.getCapabilities() : {};
  return !!caps.torch;
}

export async function setTorch(track, on) {
  await track.applyConstraints({ advanced: [{ torch: on }] });
}

export function captureFrame(videoEl) {
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  canvas.getContext("2d").drawImage(videoEl, 0, 0);
  return canvas;
}

// video is scaled/cropped by CSS object-fit:cover inside its container, so the
// guide box's on-screen rect has to be mapped back through that cover transform
// to find the matching pixel rect in the native (captured) video frame.
export function guideBoxToVideoRect(videoEl, containerEl, guideBoxEl) {
  const containerRect = containerEl.getBoundingClientRect();
  const gbRect = guideBoxEl.getBoundingClientRect();
  const nativeW = videoEl.videoWidth;
  const nativeH = videoEl.videoHeight;

  const scale = Math.max(containerRect.width / nativeW, containerRect.height / nativeH);
  const displayedW = nativeW * scale;
  const displayedH = nativeH * scale;
  const offsetX = (containerRect.width - displayedW) / 2;
  const offsetY = (containerRect.height - displayedH) / 2;

  const relLeft = gbRect.left - containerRect.left;
  const relTop = gbRect.top - containerRect.top;

  const x = (relLeft - offsetX) / scale;
  const y = (relTop - offsetY) / scale;
  const w = gbRect.width / scale;
  const h = gbRect.height / scale;

  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    w: Math.min(w, nativeW - Math.max(0, x)),
    h: Math.min(h, nativeH - Math.max(0, y)),
  };
}
