import { useState, useRef, useCallback, useEffect } from "react";

const getSpeechRecognition = () =>
  window.SpeechRecognition || window.webkitSpeechRecognition;

const joinTranscript = (...parts) => parts.filter(Boolean).join(" ").trim();

const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);
  const transcriptRef = useRef("");
  const restartTimerRef = useRef(null);
  const stopResolverRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setIsSupported(!!getSpeechRecognition());

    return () => {
      mountedRef.current = false;
      shouldListenRef.current = false;
      clearTimeout(restartTimerRef.current);
      recognitionRef.current?.abort();
    };
  }, []);

  const createRecognition = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition || !shouldListenRef.current) return;

    const recognition = new SpeechRecognition();
    let interimTranscript = "";
    const finalizedIndexes = new Set();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (mountedRef.current && recognitionRef.current === recognition) {
        setVoiceError("");
        setIsListening(true);
      }
    };

    recognition.onresult = (event) => {
      interimTranscript = "";

      // resultIndex points to the first result changed in this event.
      // Append only new final results, so earlier words are never duplicated.
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const spokenText = result[0]?.transcript?.trim();
        if (!spokenText) continue;

        if (result.isFinal) {
          if (!finalizedIndexes.has(i)) {
            finalizedIndexes.add(i);
            transcriptRef.current = joinTranscript(
              transcriptRef.current,
              spokenText,
            );
          }
        } else {
          interimTranscript = joinTranscript(interimTranscript, spokenText);
        }
      }

      if (mountedRef.current) {
        setTranscript(
          joinTranscript(transcriptRef.current, interimTranscript),
        );
      }
    };

    recognition.onerror = (event) => {
      if (recognitionRef.current !== recognition) return;

      const messages = {
        "not-allowed": "Microphone permission denied. Allow microphone access in your browser.",
        "service-not-allowed": "Speech recognition is blocked by the browser.",
        "audio-capture": "No microphone was found. Check your microphone connection.",
        network: "Speech recognition network error. Check your internet connection and try again.",
      };

      if (messages[event.error] && mountedRef.current) {
        setVoiceError(messages[event.error]);
      }

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture"
      ) {
        shouldListenRef.current = false;
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      if (!shouldListenRef.current || !mountedRef.current) {
        if (mountedRef.current) setIsListening(false);
        if (stopResolverRef.current) {
          stopResolverRef.current(transcriptRef.current);
          stopResolverRef.current = null;
        }
        return;
      }

      // Chrome may end a continuous session after a pause.
      // Start a fresh session without asking the candidate to toggle the mic.
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = setTimeout(() => {
        if (shouldListenRef.current) createRecognition();
      }, 400);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      recognitionRef.current = null;
      shouldListenRef.current = false;
      if (mountedRef.current) {
        setIsListening(false);
        setVoiceError(error.message || "Could not start speech recognition.");
      }
      if (stopResolverRef.current) {
        stopResolverRef.current(transcriptRef.current);
        stopResolverRef.current = null;
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (!getSpeechRecognition() || shouldListenRef.current) return;

    setVoiceError("");
    shouldListenRef.current = true;
    clearTimeout(restartTimerRef.current);
    createRecognition();
  }, [createRecognition]);

  // Wait for onend so the browser can deliver its final result before submit.
  const stopListening = useCallback(() => {
    if (!shouldListenRef.current && !recognitionRef.current) {
      return Promise.resolve(transcriptRef.current);
    }

    return new Promise((resolve) => {
      stopResolverRef.current = resolve;
      shouldListenRef.current = false;
      clearTimeout(restartTimerRef.current);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          recognitionRef.current = null;
          setIsListening(false);
          stopResolverRef.current?.(transcriptRef.current);
          stopResolverRef.current = null;
        }
      } else {
        setIsListening(false);
        stopResolverRef.current?.(transcriptRef.current);
        stopResolverRef.current = null;
      }
    });
  }, []);

  const speak = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) {
      onEnd?.();
      return;
    }

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

  const clearTranscript = useCallback(() => {
    transcriptRef.current = "";
    setTranscript("");
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    voiceError,
    startListening,
    stopListening,
    speak,
    cancelSpeaking,
    clearTranscript,
  };
};

export default useVoice;
