import { useCallback, useEffect, useRef, useState } from "react";
import {
  enterInterviewFullscreen,
  exitInterviewFullscreen,
  isInterviewFullscreen,
  watchInterviewFullscreen,
} from "../utils/interviewFullscreen.js";

const useInterviewFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(isInterviewFullscreen);
  const [hasEnteredFullscreen, setHasEnteredFullscreen] = useState(isInterviewFullscreen);
  const [fullscreenError, setFullscreenError] = useState(null);
  const [resumingFullscreen, setResumingFullscreen] = useState(false);
  const lifecycleRef = useRef({ generation: 0 });

  useEffect(() => {
    const lifecycle = lifecycleRef.current;
    const generation = ++lifecycle.generation;
    const stopWatching = watchInterviewFullscreen((fullscreen) => {
      setIsFullscreen(fullscreen);
      if (fullscreen) setHasEnteredFullscreen(true);
    });

    return () => {
      stopWatching();
      // Ignore React StrictMode's immediate cleanup/setup cycle.
      queueMicrotask(() => {
        if (lifecycle.generation === generation) void exitInterviewFullscreen();
      });
    };
  }, []);

  const resumeFullscreen = useCallback(async () => {
    setResumingFullscreen(true);
    setFullscreenError(null);
    try {
      // Called directly by Cancel/Enter fullscreen to retain user activation.
      await enterInterviewFullscreen();
      setIsFullscreen(isInterviewFullscreen());
      setHasEnteredFullscreen(true);
      return true;
    } catch (error) {
      setFullscreenError(error.message);
      return false;
    } finally {
      setResumingFullscreen(false);
    }
  }, []);

  return {
    isFullscreen,
    hasEnteredFullscreen,
    fullscreenError,
    resumingFullscreen,
    resumeFullscreen,
  };
};

export default useInterviewFullscreen;
