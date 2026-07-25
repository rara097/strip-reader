export async function startCamera(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: "environment" },
      // Match the portrait guide box's aspect ratio (see .camera-wrap in
      // style.css). Requesting a 16:9 landscape frame here made object-fit:
      // cover crop most of the width off to fill the taller box, which read
      // as the camera being "zoomed in".
      aspectRatio: { ideal: 3 / 4 },
      width: { ideal: 1080 },
      height: { ideal: 1440 },
    },
    audio: false,
  });
  videoEl.srcObject = stream;
  await videoEl.play();

  // Some multi-lens phones default a fresh track to a non-1x zoom (e.g. the
  // "environment" logical camera picking a 2x crop). Reset to 1x where the
  // device exposes zoom control, so field of view matches what's on screen.
  const track = stream.getVideoTracks()[0];
  const caps = track.getCapabilities ? track.getCapabilities() : {};
  if (caps.zoom) {
    const min = caps.zoom.min ?? 1;
    const max = caps.zoom.max ?? 1;
    const target = Math.min(Math.max(1, min), max);
    try {
      await track.applyConstraints({ advanced: [{ zoom: target }] });
    } catch {
      // capability reported but the device rejected the constraint; not fatal
    }
  }

  return stream;
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
