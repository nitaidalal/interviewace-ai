import { useState, useCallback } from "react";

const useVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported = typeof window !== "undefined" && !!window.speechSynthesis;

  const speak = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancelSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, isSupported, speak, cancelSpeaking };
};

export default useVoice;
