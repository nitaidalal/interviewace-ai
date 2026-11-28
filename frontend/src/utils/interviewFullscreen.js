export const isInterviewFullscreen = () =>
  document.fullscreenElement === document.documentElement;

export const watchInterviewFullscreen = (onChange) => {
  const syncFullscreen = () => onChange(isInterviewFullscreen());
  syncFullscreen();
  document.addEventListener("fullscreenchange", syncFullscreen);
  return () => document.removeEventListener("fullscreenchange", syncFullscreen);
};

export const enterInterviewFullscreen = async () => {
  if (isInterviewFullscreen()) return;

  if (!document.documentElement.requestFullscreen || !document.fullscreenEnabled) {
    throw new Error("Fullscreen is unavailable. Please use a browser that supports fullscreen interviews.");
  }

  try {
    await document.documentElement.requestFullscreen();
  } catch {
    throw new Error("Fullscreen could not start. Allow fullscreen and try again.");
  }
};

export const exitInterviewFullscreen = async () => {
  if (!isInterviewFullscreen()) return;
  try {
    await document.exitFullscreen();
  } catch {
    // The browser may already have left fullscreen.
  }
};
