import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import SessionHeader from "../features/interview/session/SessionHeader.jsx";
import AIPresenter from "../features/interview/session/AIPresenter.jsx";
import QuestionCard from "../features/interview/session/QuestionCard.jsx";
import AnswerInput from "../features/interview/session/AnswerInput.jsx";
import FeedbackBubble from "../features/interview/session/FeedbackBubble.jsx";
import WebcamFeed from "../features/interview/session/WebcamFeed.jsx";
import AbandonModal from "../features/interview/session/AbandonModal.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import useInterview from "../hooks/useInterview.js";
import useVoice from "../hooks/useVoice.js";
import useWebcam from "../hooks/useWebcam.js";

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
    isListening,
    isSpeaking,
    transcript,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
    speak,
    cancelSpeaking,
    clearTranscript,
  } = useVoice();

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
  const [timerPaused, setTimerPaused] = useState(true); // start paused until greeting done
  const [aiState, setAiState] = useState("idle");
  const [isAwaitingNextQuestion, setIsAwaitingNextQuestion] = useState(false);

  // Controls whether the question card is visible
  // Hidden during greeting speech, shown after
  const [questionVisible, setQuestionVisible] = useState(false);

  const startTimeRef = useRef(null);
  const greetingSpokenRef = useRef(false);
  const prevQuestionIndex = useRef(0);
  const abandonLoadingRef = useRef(false);
  

  // ── On mount ──────────────────────────────────────────────────
  useEffect(() => {
    requestWebcam();
    if (!sessionId && id) fetchSession(id);

    return () => {
      stopWebcam();
      cancelSpeaking();
    };
  }, []);

  // ── Speak greeting → then reveal + speak Q1 ───────────────────
  useEffect(() => {
    if (!greeting || !currentQuestion) return;
    if (greetingSpokenRef.current) return;
    greetingSpokenRef.current = true;

    setAiState("speaking");
    setQuestionVisible(false); // hide question during greeting
    setTimerPaused(true);

    const speakQ1 = () => {
      // Now reveal the question card
      setQuestionVisible(true);
      setAiState("speaking");

      speak(currentQuestion.content, () => {
        setAiState("idle");
        // Start timer only after Q1 has been spoken
        setIsAwaitingNextQuestion(false);
        setTimerPaused(false);
        startTimeRef.current = Date.now();
        prevQuestionIndex.current = currentQuestion.index;
      });
    };

    if (isVoiceSupported) {
      speak(greeting, speakQ1);
    } else {
      // No voice — just show question after short delay
      setTimeout(() => {
        setQuestionVisible(true);
        setTimerPaused(false);
        startTimeRef.current = Date.now();
        prevQuestionIndex.current = currentQuestion.index;
      }, 1500);
    }
  }, [greeting, currentQuestion?.index]);

  // ── When feedback arrives — speak it → then reveal next Q ─────
  useEffect(() => {
    if (!feedback?.text) return;

    setIsAwaitingNextQuestion(true);
    setTimerPaused(true);
    setAiState("speaking");

    const afterFeedback = () => {
      if (isLastQuestion) {
        setAiState("idle");
        // auto end handled by separate effect
        return;
      }

      if (pendingNextQuestion) {
        // Reveal next question in messages + state
        revealNextQuestion();
        // revealNextQuestion sets currentQuestion →
        // triggers the effect below to speak + reset timer
      }

      setAiState("idle");
    };

    if (isVoiceSupported) {
      speak(feedback.text, afterFeedback);
    } else {
      // No voice — just reveal after delay
      setTimeout(afterFeedback, 800);
    }
  }, [feedback?.text]);

  // ── When currentQuestion index changes (Q2, Q3...) ────────────
  useEffect(() => {
    if (!currentQuestion) return;
    if (currentQuestion.index <= 1) return; // Q1 handled above
    if (currentQuestion.index === prevQuestionIndex.current) return; // no change

    prevQuestionIndex.current = currentQuestion.index;

    setAnswer("");
    clearTranscript();
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
    if (status === "submitting") setAiState("thinking");
    else if (isSpeaking) setAiState("speaking");
    else if (isListening) setAiState("listening");
    // don't set idle here — handled in speak() callbacks
  }, [isSpeaking, isListening, status]);

  // ── Auto-end after last question feedback spoken ───────────────
  useEffect(() => {
    if (!isLastQuestion || status !== "active") return;
    // Give 3s after last feedback before ending
    const t = setTimeout(() => {
      endInterview();
    }, 3000);
    return () => clearTimeout(t);
  }, [isLastQuestion, status]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleTimeout = useCallback(() => {
    if (status === "submitting") return;
    const elapsed = Math.round(
      (Date.now() - (startTimeRef.current ?? Date.now())) / 1000,
    );
    setTimerPaused(true);
    cancelSpeaking();
    submitAnswer({
      answer,
      timedOut: true,
      responseTimeSeconds: elapsed,
      isCodingAnswer: currentQuestion?.isCodingQuestion ?? false,
    });
    setAnswer("");
  }, [answer, currentQuestion, status]);

  const handleSubmit = useCallback(() => {
    if (status === "submitting") return;
    if (isListening) stopListening();
    cancelSpeaking();

    const elapsed = Math.round(
      (Date.now() - (startTimeRef.current ?? Date.now())) / 1000,
    );
    setTimerPaused(true);

    submitAnswer({
      answer,
      timedOut: false,
      responseTimeSeconds: elapsed,
      isCodingAnswer: currentQuestion?.isCodingQuestion ?? false,
    });
    setAnswer("");
  }, [answer, currentQuestion, status, isListening]);

  const handleAbandon = async () => {
    abandonLoadingRef.current = true;
    stopWebcam();
    cancelSpeaking();
    await abandonInterview();
  };

  // ── Loading states ────────────────────────────────────────────
  if (status === "loading" || (!currentQuestion && status !== "ending")) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
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
      <div className="min-h-[80vh] flex items-center justify-center">
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
      className="max-w-3xl mx-auto flex flex-col gap-4"
    >
      {/* Webcam */}
      <div className="flex justify-end">
        <WebcamFeed
          videoRef={videoRef}
          enabled={webcamEnabled}
          denied={webcamDenied}
          loading={webcamLoading}
        />
      </div>

      {/* Session header */}
      <SessionHeader
        key={timerKey}
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        timeLimit={currentQuestion?.timeLimitSeconds ?? 60}
        onTimeout={handleTimeout}
        onAbandon={() => setShowAbandon(true)}
        paused={timerPaused}
      />

      {/* AI Presenter */}
      <div className="flex justify-center py-4">
        <AIPresenter aiState={aiState} />
      </div>

      {/* Greeting text — only shown while on Q1 before question visible */}
      <AnimatePresence>
        {greeting && !questionVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-center italic px-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            {greeting}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question card — hidden during greeting */}
      <AnimatePresence>
        {questionVisible && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <QuestionCard
              question={currentQuestion.content}
              index={questionIndex}
              total={totalQuestions}
              isCoding={currentQuestion.isCodingQuestion}
              codingLanguage={currentQuestion.codingLanguage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Feedback bubble */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <FeedbackBubble feedback={feedback.text} score={feedback.score} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer input — shown only when question visible + not last + not paused for speaking */}
      <AnimatePresence>
        {questionVisible && !isLastQuestion && !isAwaitingNextQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AnswerInput
              isCoding={currentQuestion?.isCodingQuestion}
              codingLanguage={currentQuestion?.codingLanguage}
              value={answer}
              onChange={setAnswer}
              onSubmit={handleSubmit}
              loading={status === "submitting"}
              isListening={isListening}
              isSpeaking={isSpeaking}
              transcript={transcript}
              onVoiceStart={startListening}
              onVoiceStop={stopListening}
              isVoiceSupported={isVoiceSupported}
              disabled={status === "submitting"}
            />
          </motion.div>
        )}
      </AnimatePresence>

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

export default InterviewSessionPage;
