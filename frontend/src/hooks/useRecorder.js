import { useState, useRef, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { transcribeAudio } from "../api/speechApi.js";
import { parseApiError } from "../utils/errorParser.js";

const isSupported =
  typeof MediaRecorder !== "undefined" &&
  !!navigator.mediaDevices?.getUserMedia;

// Pick a format this browser can record (Chrome/Firefox: webm, Safari: mp4)
const getMimeType = () =>
  ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) =>
    MediaRecorder.isTypeSupported(type),
  ) ?? "";

const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserFrameRef = useRef(null);
  const stopPromiseRef = useRef(null);
  const stoppingRef = useRef(false);

  const stopLevelMonitor = useCallback(() => {
    if (analyserFrameRef.current) {
      cancelAnimationFrame(analyserFrameRef.current);
      analyserFrameRef.current = null;
    }
    if (audioContextRef.current) {
      const audioContext = audioContextRef.current;
      audioContextRef.current = null;
      audioContext.close().catch(() => {});
    }
    setAudioLevel(0);
  }, []);

  const releaseMic = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  // Sends the audio to our backend and returns the text ('' if nothing worked)
  const transcribe = useCallback(async (blob) => {
    if (blob.size === 0) return "";

    setIsTranscribing(true);
    try {
      const extension = blob.type.includes("mp4") ? "mp4" : "webm";
      const formData = new FormData();
      formData.append("audio", blob, `answer.${extension}`);

      const res = await transcribeAudio(formData);
      const text = res.data.data.text;

      if (!text)
        toast.error(
          "We couldn't hear anything. Try again or type your answer.",
        );
      return text;
    } catch (err) {
      toast.error(parseApiError(err));
      return "";
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSupported || recorderRef.current) return;
    stoppingRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getMimeType();
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        source.connect(analyser);
        audioContextRef.current = audioContext;

        const levels = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          analyser.getByteFrequencyData(levels);
          const average =
            levels.reduce((sum, level) => sum + level, 0) / levels.length;
          setAudioLevel(Math.min(1, average / 80));
          analyserFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      }

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.start();
      streamRef.current = stream;
      recorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      toast.error(
        "Microphone access denied. Allow the mic or type your answer.",
      );
    }
  }, []);

  // Returns a Promise that resolves with the transcribed text
  const stopRecording = useCallback(() => {
    if (stopPromiseRef.current) return stopPromiseRef.current;

    const recorder = recorderRef.current;
    if (!recorder || stoppingRef.current) return Promise.resolve("");

    stoppingRef.current = true;
    const promise = new Promise((resolve) => {
      recorder.onstop = async () => {
        releaseMic();
        stopLevelMonitor();
        recorderRef.current = null;
        setIsRecording(false);

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const text = await transcribe(blob);
        resolve(text);
        stopPromiseRef.current = null;
        stoppingRef.current = false;
      };
      recorder.stop();
    });
    stopPromiseRef.current = promise;
    return promise;
  }, [releaseMic, stopLevelMonitor, transcribe]);

  const pauseRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.pause();
  }, []);

  const resumeRecording = useCallback(() => {
    if (recorderRef.current?.state === "paused") recorderRef.current.resume();
  }, []);

  // Turn the mic off if the user leaves the page mid-recording.
  useEffect(() => {
    return () => {
      if (["recording", "paused"].includes(recorderRef.current?.state))
        recorderRef.current.stop();
      releaseMic();
      stopLevelMonitor();
    };
  }, [releaseMic, stopLevelMonitor]);

  return {
    isRecording,
    isTranscribing,
    audioLevel,
    isSupported,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
};

export default useRecorder;
