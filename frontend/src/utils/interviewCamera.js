let preparation = null;

// Resolve the browser permission prompt before Start enters fullscreen.
// Share an in-flight request across React StrictMode's effect replay.
export const prepareInterviewCamera = () => {
  if (preparation) return preparation;
  preparation = (async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false,
      });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      // Camera access is optional; the session also supports camera-off mode.
    }
  })().finally(() => { preparation = null; });
  return preparation;
};
