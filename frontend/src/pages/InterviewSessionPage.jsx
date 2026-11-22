// import { useEffect, useState, useCallback, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import SessionHeader from "../features/interview/session/SessionHeader.jsx";
// import AIPresenter from "../features/interview/session/AIPresenter.jsx";
// import QuestionCard from "../features/interview/session/QuestionCard.jsx";
// import AnswerInput from "../features/interview/session/AnswerInput.jsx";
// import FeedbackBubble from "../features/interview/session/FeedbackBubble.jsx";
// import WebcamFeed from "../features/interview/session/WebcamFeed.jsx";
// import AbandonModal from "../features/interview/session/AbandonModal.jsx";
// import Spinner from "../components/ui/Spinner.jsx";
// import useInterview from "../hooks/useInterview.js";
// import useVoice from "../hooks/useVoice.js";
// import useWebcam from "../hooks/useWebcam.js";

// const InterviewSessionPage = () => {
//   const { id } = useParams();

//   const {
//     currentQuestion,
//     feedback,
//     questionIndex,
//     totalQuestions,
//     isLastQuestion,
//     status,
//     submitAnswer,
//     endInterview,
//     abandonInterview,
//     fetchSession,
//     sessionId,
//     pendingNextQuestion,
//     revealNextQuestion,
//     greeting,
//   } = useInterview();

//   const {
//     isListening,
//     isSpeaking,
//     transcript,
//     isSupported: isVoiceSupported,
//     startListening,
//     stopListening,
//     speak,
//     cancelSpeaking,
//     clearTranscript,
//   } = useVoice();

//   const {
//     videoRef,
//     enabled: webcamEnabled,
//     denied: webcamDenied,
//     loading: webcamLoading,
//     requestWebcam,
//     stopWebcam,
//   } = useWebcam();

//   const [answer, setAnswer] = useState("");
//   const [showAbandon, setShowAbandon] = useState(false);
//   const [timerKey, setTimerKey] = useState(0);
//   const [timerPaused, setTimerPaused] = useState(true); // start paused until greeting done
//   const [aiState, setAiState] = useState("idle");
//   const [isAwaitingNextQuestion, setIsAwaitingNextQuestion] = useState(false);

//   // Controls whether the question card is visible
//   // Hidden during greeting speech, shown after
//   const [questionVisible, setQuestionVisible] = useState(false);

//   const startTimeRef = useRef(null);
//   const greetingSpokenRef = useRef(false);
//   const prevQuestionIndex = useRef(0);
//   const abandonLoadingRef = useRef(false);
  

//   // ── On mount ──────────────────────────────────────────────────
//   useEffect(() => {
//     requestWebcam();
//     if (!sessionId && id) fetchSession(id);

//     return () => {
//       stopWebcam();
//       cancelSpeaking();
//     };
//   }, []);

//   // ── Speak greeting → then reveal + speak Q1 ───────────────────
//   useEffect(() => {
//     if (!greeting || !currentQuestion) return;
//     if (greetingSpokenRef.current) return;
//     greetingSpokenRef.current = true;

//     setAiState("speaking");
//     setQuestionVisible(false); // hide question during greeting
//     setTimerPaused(true);

//     const speakQ1 = () => {
//       // Now reveal the question card
//       setQuestionVisible(true);
//       setAiState("speaking");

//       speak(currentQuestion.content, () => {
//         setAiState("idle");
//         // Start timer only after Q1 has been spoken
//         setIsAwaitingNextQuestion(false);
//         setTimerPaused(false);
//         startTimeRef.current = Date.now();
//         prevQuestionIndex.current = currentQuestion.index;
//       });
//     };

//     if (isVoiceSupported) {
//       speak(greeting, speakQ1);
//     } else {
//       // No voice — just show question after short delay
//       setTimeout(() => {
//         setQuestionVisible(true);
//         setTimerPaused(false);
//         startTimeRef.current = Date.now();
//         prevQuestionIndex.current = currentQuestion.index;
//       }, 1500);
//     }
//   }, [greeting, currentQuestion?.index]);

//   // ── When feedback arrives — speak it → then reveal next Q ─────
//   useEffect(() => {
//     if (!feedback?.text) return;

//     setIsAwaitingNextQuestion(true);
//     setTimerPaused(true);
//     setAiState("speaking");

//     const afterFeedback = () => {
//       if (isLastQuestion) {
//         setAiState("idle");
//         // auto end handled by separate effect
//         return;
//       }

//       if (pendingNextQuestion) {
//         // Reveal next question in messages + state
//         revealNextQuestion();
//         // revealNextQuestion sets currentQuestion →
//         // triggers the effect below to speak + reset timer
//       }

//       setAiState("idle");
//     };

//     if (isVoiceSupported) {
//       speak(feedback.text, afterFeedback);
//     } else {
//       // No voice — just reveal after delay
//       setTimeout(afterFeedback, 800);
//     }
//   }, [feedback?.text]);

//   // ── When currentQuestion index changes (Q2, Q3...) ────────────
//   useEffect(() => {
//     if (!currentQuestion) return;
//     if (currentQuestion.index <= 1) return; // Q1 handled above
//     if (currentQuestion.index === prevQuestionIndex.current) return; // no change

//     prevQuestionIndex.current = currentQuestion.index;

//     setAnswer("");
//     clearTranscript();
//     setTimerKey((k) => k + 1);
//     setTimerPaused(true);
//     setQuestionVisible(true);
//     setIsAwaitingNextQuestion(false);
//     setAiState("speaking");

//     speak(currentQuestion.content, () => {
//       setAiState("idle");
//       setTimerPaused(false);
//       startTimeRef.current = Date.now();
//     });
//   }, [currentQuestion?.index]);

//   // ── AI state sync ─────────────────────────────────────────────
//   useEffect(() => {
//     if (status === "submitting") setAiState("thinking");
//     else if (isSpeaking) setAiState("speaking");
//     else if (isListening) setAiState("listening");
//     // don't set idle here — handled in speak() callbacks
//   }, [isSpeaking, isListening, status]);

//   // ── Auto-end after last question feedback spoken ───────────────
//   useEffect(() => {
//     if (!isLastQuestion || status !== "active") return;
//     // Give 3s after last feedback before ending
//     const t = setTimeout(() => {
//       endInterview();
//     }, 3000);
//     return () => clearTimeout(t);
//   }, [isLastQuestion, status]);

//   // ── Handlers ──────────────────────────────────────────────────
//   const handleTimeout = useCallback(() => {
//     if (status === "submitting") return;
//     const elapsed = Math.round(
//       (Date.now() - (startTimeRef.current ?? Date.now())) / 1000,
//     );
//     setTimerPaused(true);
//     cancelSpeaking();
//     submitAnswer({
//       answer,
//       timedOut: true,
//       responseTimeSeconds: elapsed,
//       isCodingAnswer: currentQuestion?.isCodingQuestion ?? false,
//     });
//     setAnswer("");
//   }, [answer, currentQuestion, status]);

//   const handleSubmit = useCallback(() => {
//     if (status === "submitting") return;
//     if (isListening) stopListening();
//     cancelSpeaking();

//     const elapsed = Math.round(
//       (Date.now() - (startTimeRef.current ?? Date.now())) / 1000,
//     );
//     setTimerPaused(true);

//     submitAnswer({
//       answer,
//       timedOut: false,
//       responseTimeSeconds: elapsed,
//       isCodingAnswer: currentQuestion?.isCodingQuestion ?? false,
//     });
//     setAnswer("");
//   }, [answer, currentQuestion, status, isListening]);

//   const handleAbandon = async () => {
//     abandonLoadingRef.current = true;
//     stopWebcam();
//     cancelSpeaking();
//     await abandonInterview();
//   };

//   // ── Loading states ────────────────────────────────────────────
//   if (status === "loading" || (!currentQuestion && status !== "ending")) {
//     return (
//       <div className="min-h-[80vh] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Spinner size="lg" />
//           <p style={{ color: "var(--color-text-secondary)" }}>
//             Setting up your interview...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (status === "ending" || status === "done") {
//     return (
//       <div className="min-h-[80vh] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Spinner size="lg" />
//           <p style={{ color: "var(--color-text-secondary)" }}>
//             Generating your evaluation...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-3xl mx-auto flex flex-col gap-4"
//     >
//       {/* Webcam */}
//       <div className="flex justify-end">
//         <WebcamFeed
//           videoRef={videoRef}
//           enabled={webcamEnabled}
//           denied={webcamDenied}
//           loading={webcamLoading}
//         />
//       </div>

//       {/* Session header */}
//       <SessionHeader
//         key={timerKey}
//         questionIndex={questionIndex}
//         totalQuestions={totalQuestions}
//         timeLimit={currentQuestion?.timeLimitSeconds ?? 60}
//         onTimeout={handleTimeout}
//         onAbandon={() => setShowAbandon(true)}
//         paused={timerPaused}
//       />

//       {/* AI Presenter */}
//       <div className="flex justify-center py-4">
//         <AIPresenter aiState={aiState} />
//       </div>

//       {/* Greeting text — only shown while on Q1 before question visible */}
//       <AnimatePresence>
//         {greeting && !questionVisible && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             className="text-sm text-center italic px-4"
//             style={{ color: "var(--color-text-muted)" }}
//           >
//             {greeting}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Question card — hidden during greeting */}
//       <AnimatePresence>
//         {questionVisible && currentQuestion && (
//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.35 }}
//           >
//             <QuestionCard
//               question={currentQuestion.content}
//               index={questionIndex}
//               total={totalQuestions}
//               isCoding={currentQuestion.isCodingQuestion}
//               codingLanguage={currentQuestion.codingLanguage}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* AI Feedback bubble */}
//       <AnimatePresence>
//         {feedback && (
//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//           >
//             <FeedbackBubble feedback={feedback.text} score={feedback.score} />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Answer input — shown only when question visible + not last + not paused for speaking */}
//       <AnimatePresence>
//         {questionVisible && !isLastQuestion && !isAwaitingNextQuestion && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//           >
//             <AnswerInput
//               isCoding={currentQuestion?.isCodingQuestion}
//               codingLanguage={currentQuestion?.codingLanguage}
//               value={answer}
//               onChange={setAnswer}
//               onSubmit={handleSubmit}
//               loading={status === "submitting"}
//               isListening={isListening}
//               isSpeaking={isSpeaking}
//               transcript={transcript}
//               onVoiceStart={startListening}
//               onVoiceStop={stopListening}
//               isVoiceSupported={isVoiceSupported}
//               disabled={status === "submitting"}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Abandon modal */}
//       <AbandonModal
//         open={showAbandon}
//         onConfirm={handleAbandon}
//         onCancel={() => setShowAbandon(false)}
//         loading={abandonLoadingRef.current}
//       />
//     </motion.div>
//   );
// };

// export default InterviewSessionPage;


import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdOutlineMic, MdOutlineMicOff } from 'react-icons/md'
import LeftPanel from '../features/interview/session/LeftPanel.jsx'
import RightPanel from '../features/interview/session/RightPanel.jsx'
import AbandonModal from '../features/interview/session/AbandonModal.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import useInterview from '../hooks/useInterview.js'
import useVoice from '../hooks/useVoice.js'
import useWebcam from '../hooks/useWebcam.js'
import useRecorder from "../hooks/useRecorder.js";

/**
 * Derives the answer zone state from interview state.
 *
 * 'speaking'   → AI reading question, input disabled
 * 'answering'  → user can type/speak freely
 * 'submitting' → API call in flight
 * 'feedback'   → feedback card shown, no input
 * 'ended'      → last question done
 */
const deriveZoneState = ({
  isAwaitingNextQuestion,
  timerPaused,
  status,
  isLastQuestion,
  feedback,
  questionVisible,
}) => {
  if (!questionVisible) return 'speaking'
  if (isLastQuestion && feedback) return 'ended'
  if (isAwaitingNextQuestion) return 'feedback'
  if (status === 'submitting') return 'submitting'
  if (timerPaused) return 'speaking'
  return 'answering'
}

const appendText = (base, text) =>
  text ? `${base} ${text}`.trim() : base

const InterviewSessionPage = () => {
  const { id } = useParams();

  const {
    currentQuestion,
    feedback,
    questionIndex,
    totalQuestions,
    isLastQuestion,
    status,
    submitAnswer,
    endInterview,
    abandonInterview,
    fetchSession,
    sessionId,
    pendingNextQuestion,
    revealNextQuestion,
    greeting,
  } = useInterview();

  const {
    isSpeaking,
    isSupported: isVoiceSupported,
    speak,
    cancelSpeaking,
  } = useVoice();

  const {
    isRecording,
    isTranscribing,
    audioLevel,
    isSupported: isRecorderSupported,
    startRecording,
    stopRecording,
  } = useRecorder();

  const {
    videoRef,
    enabled: webcamEnabled,
    denied: webcamDenied,
    loading: webcamLoading,
    requestWebcam,
    stopWebcam,
  } = useWebcam();

  const [answer, setAnswer] = useState("");
  const [showAbandon, setShowAbandon] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [timerPaused, setTimerPaused] = useState(true);
  const [aiState, setAiState] = useState("idle");
  const [questionVisible, setQuestionVisible] = useState(false);
  const [isAwaitingNextQuestion, setIsAwaitingNextQuestion] = useState(false);

  const startTimeRef = useRef(null);
  const greetingSpokenRef = useRef(false);
  const prevQuestionIndex = useRef(0);
  const abandonLoadingRef = useRef(false);
  const submitLockRef = useRef(false);

  // ── On mount ──────────────────────────────────────────────────
  useEffect(() => {
    requestWebcam();
    if (!sessionId && id) fetchSession(id);
    return () => {
      stopWebcam();
      cancelSpeaking();
    };
  }, []);

  // ── Speak greeting → reveal + speak Q1 ───────────────────────
  useEffect(() => {
    if (!greeting || !currentQuestion) return;
    if (greetingSpokenRef.current) return;
    greetingSpokenRef.current = true;

    setAiState("speaking");
    setQuestionVisible(false);
    setTimerPaused(true);

    const speakQ1 = () => {
      setQuestionVisible(true);
      setAiState("speaking");
      speak(currentQuestion.content, () => {
        setAiState("idle");
        setIsAwaitingNextQuestion(false);
        setTimerPaused(false);
        startTimeRef.current = Date.now();
        prevQuestionIndex.current = currentQuestion.index;
      });
    };

    if (isVoiceSupported) {
      speak(greeting, speakQ1);
    } else {
      setTimeout(() => {
        setQuestionVisible(true);
        setIsAwaitingNextQuestion(false);
        setTimerPaused(false);
        startTimeRef.current = Date.now();
        prevQuestionIndex.current = currentQuestion.index;
      }, 1200);
    }
  }, [greeting, currentQuestion?.index]);

  // ── Feedback arrives → speak → reveal next Q ─────────────────
  useEffect(() => {
    if (!feedback?.text) return;

    setIsAwaitingNextQuestion(true);
    setTimerPaused(true);
    setAiState("speaking");

    const afterFeedback = () => {
      if (isLastQuestion) {
        setAiState("idle");
        return;
      }
      if (pendingNextQuestion) revealNextQuestion();
      setAiState("idle");
    };

    if (isVoiceSupported) {
      speak(feedback.text, afterFeedback);
    } else {
      setTimeout(afterFeedback, 800);
    }
  }, [feedback?.text]);

  // ── Question index changes → speak new question ───────────────
  useEffect(() => {
    if (!currentQuestion) return;
    if (currentQuestion.index <= 1) return;
    if (currentQuestion.index === prevQuestionIndex.current) return;

    prevQuestionIndex.current = currentQuestion.index;

    setAnswer("");
    setTimerKey((k) => k + 1);
    setTimerPaused(true);
    setQuestionVisible(true);
    setIsAwaitingNextQuestion(false);
    setAiState("speaking");

    speak(currentQuestion.content, () => {
      setAiState("idle");
      setTimerPaused(false);
      startTimeRef.current = Date.now();
    });
  }, [currentQuestion?.index]);

  // ── AI state sync ─────────────────────────────────────────────
  useEffect(() => {
    if (status === "submitting" || isTranscribing) setAiState("thinking");
    else if (isSpeaking) setAiState("speaking");
    else if (isRecording) setAiState("listening");
  }, [isSpeaking, isRecording, isTranscribing, status]);

  // ── Auto-end after last question ──────────────────────────────
  useEffect(() => {
    if (!isLastQuestion || status !== "active") return;
    const t = setTimeout(() => endInterview(), 3000);
    return () => clearTimeout(t);
  }, [isLastQuestion, status]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleTimeout = useCallback(async () => {
    if (status === "submitting" || submitLockRef.current) return;
    submitLockRef.current = true;

    try {
      const elapsed = Math.round(
        (Date.now() - (startTimeRef.current ?? Date.now())) / 1000,
      );
      setTimerPaused(true);
      cancelSpeaking();

      let finalAnswer = answer;
      const transcribedAnswer = await stopRecording();
      finalAnswer = appendText(answer, transcribedAnswer);

      await submitAnswer({
        answer: finalAnswer,
        timedOut: !finalAnswer.trim(),
        responseTimeSeconds: elapsed,
        isCodingAnswer: currentQuestion?.isCodingQuestion ?? false,
      });
      setAnswer("");
    } finally {
      submitLockRef.current = false;
    }
  }, [answer, currentQuestion, status, isRecording, stopRecording, cancelSpeaking, submitAnswer]);

  const handleSubmit = useCallback(async () => {
    if (status === "submitting" || isTranscribing || submitLockRef.current) return;
    submitLockRef.current = true;

    try {
      const elapsed = Math.round(
        (Date.now() - (startTimeRef.current ?? Date.now())) / 1000,
      );
      setTimerPaused(true);
      cancelSpeaking();

      let finalAnswer = answer;
      const transcribedAnswer = await stopRecording();
      finalAnswer = appendText(answer, transcribedAnswer);

      await submitAnswer({
        answer: finalAnswer,
        timedOut: false,
        responseTimeSeconds: elapsed,
        isCodingAnswer: currentQuestion?.isCodingQuestion ?? false,
      });
      setAnswer("");
    } finally {
      submitLockRef.current = false;
    }
  }, [answer, currentQuestion, status, isRecording, isTranscribing, stopRecording, cancelSpeaking, submitAnswer]);

  const handleStopRecording = useCallback(async () => {
    const text = await stopRecording();
    if (text) setAnswer((prev) => appendText(prev, text));
  }, [stopRecording]);

  const handleToggleMic = useCallback(() => {
    if (isRecording) handleStopRecording();
    else startRecording();
  }, [isRecording, handleStopRecording, startRecording]);

  const handleToggleWebcam = useCallback(() => {
    if (webcamEnabled) stopWebcam();
    else requestWebcam();
  }, [webcamEnabled]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (status === "active" || status === "submitting") {
        e.preventDefault();
        e.returnValue = ""; // triggers browser's native "Leave site?" dialog
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [status]);

  const handleAbandon = async () => {
    abandonLoadingRef.current = true;
    stopWebcam();
    cancelSpeaking();
    await abandonInterview();
  };

  // ── Derived zone state ────────────────────────────────────────
  const zoneState = deriveZoneState({
    isAwaitingNextQuestion,
    timerPaused,
    status,
    isLastQuestion,
    feedback,
    questionVisible,
  });

  // ── Loading / ending screens ──────────────────────────────────
  if (status === "loading" || (!currentQuestion && status !== "ending")) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p style={{ color: "var(--color-text-secondary)" }}>
            Setting up your interview...
          </p>
        </div>
      </div>
    );
  }

  if (status === "ending" || status === "done") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p style={{ color: "var(--color-text-secondary)" }}>
            Generating your evaluation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── LEFT PANEL — 40% ── */}
      <div className="w-[40%] shrink-0 h-full hidden md:block">
        <LeftPanel
          aiState={aiState}
          videoRef={videoRef}
          webcamEnabled={webcamEnabled}
          webcamDenied={webcamDenied}
          webcamLoading={webcamLoading}
          onToggleWebcam={handleToggleWebcam}
          isListening={isRecording}
          onToggleMic={handleToggleMic}
          isVoiceSupported={isRecorderSupported}
          onEndCall={() => setShowAbandon(true)}
        />
      </div>

      {/* ── RIGHT PANEL — 60% ── */}
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {/* Mobile controls bar — only visible on mobile */}
        <div
          className="md:hidden flex items-center justify-between px-4 py-3 shrink-0"
          style={{
            backgroundColor: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div className="flex items-center gap-3">
            {isRecorderSupported && (
              <button
                type="button"
                onClick={handleToggleMic}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
                style={{
                  color: isRecording
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                  backgroundColor: "var(--color-surface-hover)",
                }}
                aria-label={
                  isRecording ? "Mute microphone" : "Unmute microphone"
                }
              >
                {isRecording ? (
                  <MdOutlineMic size={17} />
                ) : (
                  <MdOutlineMicOff size={17} />
                )}
                {isRecording ? "Mute" : "Unmute"}
              </button>
            )}
            {/* Mini AI presenter */}
            <div
              className="w-10 h-10 rounded-full bg-brand-gradient
                flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {aiState === "speaking"
                ? "🔊 AI Speaking..."
                : aiState === "listening"
                  ? "🎤 Listening..."
                  : aiState === "thinking"
                    ? "⏳ Thinking..."
                    : "● Ready"}
            </span>
          </div>
          <button
            onClick={() => setShowAbandon(true)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-danger) 15%, transparent)",
              color: "var(--color-danger)",
              border:
                "1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)",
            }}
          >
            End
          </button>
        </div>

        {/* Right panel content */}
        <div className="flex-1 overflow-y-auto">
          <RightPanel
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            timeLimit={currentQuestion?.timeLimitSeconds ?? 60}
            onTimeout={handleTimeout}
            timerPaused={timerPaused}
            timerKey={timerKey}
            currentQuestion={currentQuestion}
            questionVisible={questionVisible}
            zoneState={zoneState}
            answer={answer}
            onAnswerChange={setAnswer}
            onSubmit={handleSubmit}
            feedback={feedback}
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            audioLevel={audioLevel}
            isSpeaking={isSpeaking}
            isVoiceSupported={isRecorderSupported}
          />
        </div>
      </div>

      {/* Abandon modal */}
      <AbandonModal
        open={showAbandon}
        onConfirm={handleAbandon}
        onCancel={() => setShowAbandon(false)}
        loading={abandonLoadingRef.current}
      />
    </motion.div>
  );
};

export default InterviewSessionPage