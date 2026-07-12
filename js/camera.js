export async function startCamera(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    audio: false,
  });
  videoEl.srcObject = stream;
  await videoEl.play();
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
