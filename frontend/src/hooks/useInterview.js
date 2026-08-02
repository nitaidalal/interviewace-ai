import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  startInterview as startInterviewApi,
  submitAnswer as submitAnswerApi,
  endInterview as endInterviewApi,
  abandonInterview as abandonInterviewApi,
  getSession,
} from "../api/interviewApi.js";
import { parseApiError } from "../utils/errorParser.js";
import { ROUTES } from "../utils/constants.js";

const useInterview = () => {
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [pendingNextQuestion, setPendingNextQuestion] = useState(null);

  // Ref to avoid stale closure in revealNextQuestion
  const pendingNextQuestionRef = useRef(null);

  // ─── Helpers ──────────────────────────────────────────────────

  const addMessage = (role, content, type) => {
    setMessages((prev) => [
      ...prev,
      { role, content, type, timestamp: new Date() },
    ]);
  };

  const storePendingQuestion = (q) => {
    setPendingNextQuestion(q);
    pendingNextQuestionRef.current = q;
  };

  const clearPendingQuestion = () => {
    setPendingNextQuestion(null);
    pendingNextQuestionRef.current = null;
  };

  // ─── Start Interview ──────────────────────────────────────────

  const startInterview = useCallback(
    async (settings) => {
      setStatus("loading");
      try {
        const res = await startInterviewApi(settings);
        const data = res.data.data;

        setSessionId(data.sessionId);
        setGreeting(data.greeting);
        setTotalQuestions(data.totalQuestions);
        setQuestionIndex(data.firstQuestionIndex);
        setCurrentQuestion({
          content: data.firstQuestion,
          index: data.firstQuestionIndex,
          timeLimitSeconds: data.timeLimit,
          isCodingQuestion: data.isCodingQuestion,
          codingLanguage: data.codingLanguage,
        });

        setMessages([
          {
            role: "ai",
            content: data.greeting,
            type: "greeting",
            timestamp: new Date(),
          },
          {
            role: "ai",
            content: data.firstQuestion,
            type: "question",
            timestamp: new Date(),
          },
        ]);

        setStatus("active");
        navigate(`/dashboard/interview/${data.sessionId}/session`);
      } catch (err) {
        setStatus("idle");
        toast.error(parseApiError(err));
      }
    },
    [navigate],
  );

  // ─── Submit Answer ────────────────────────────────────────────

  const submitAnswer = useCallback(
    async ({
      answer,
      timedOut = false,
      responseTimeSeconds = 0,
      isCodingAnswer = false,
    }) => {
      if (!sessionId) return;
      setStatus("submitting");
      setFeedback(null);

      try {
        addMessage(
          "candidate",
          timedOut && !answer ? "(No answer submitted)" : answer,
          "answer",
        );

        const res = await submitAnswerApi(sessionId, {
          answer,
          timedOut,
          responseTimeSeconds,
          isCodingAnswer,
        });
        const data = res.data.data;

        // Add feedback to messages + set feedback state
        addMessage("ai", data.feedback, "feedback");
        setFeedback({ text: data.feedback, score: data.questionScore });

        if (data.isLastQuestion) {
          setIsLastQuestion(true);
          clearPendingQuestion();
          setStatus("active");
        } else {
          // Store next question in both state and ref
          // Page will call revealNextQuestion() after speaking feedback
          const nextQ = {
            content: data.nextQuestion.content,
            index: data.nextQuestion.index,
            timeLimitSeconds: data.nextQuestion.timeLimit,
            isCodingQuestion: data.nextQuestion.isCodingQuestion,
            codingLanguage: data.nextQuestion.codingLanguage,
          };
          storePendingQuestion(nextQ);
          setStatus("active");
        }
      } catch (err) {
        setStatus("active");
        toast.error(parseApiError(err));
      }
    },
    [sessionId],
  );

  // ─── Reveal Next Question ─────────────────────────────────────
  // Called by InterviewSessionPage after AI finishes speaking feedback
  // Uses ref to avoid stale closure problem

  const revealNextQuestion = useCallback(() => {
    const next = pendingNextQuestionRef.current;
    if (!next) return;

    addMessage("ai", next.content, "question");
    setCurrentQuestion(next);
    setQuestionIndex(next.index);
    setFeedback(null); 
    clearPendingQuestion();
  }, []); // no deps — reads from ref, never stale

  // ─── End Interview ────────────────────────────────────────────

  const endInterview = useCallback(async () => {
    if (!sessionId) return;
    setStatus("ending");
    try {
      await endInterviewApi(sessionId);
      setStatus("done");
      navigate(`/dashboard/interview/${sessionId}/result`);
    } catch (err) {
      setStatus("active");
      toast.error(parseApiError(err));
    }
  }, [sessionId, navigate]);

  // ─── Abandon Interview ────────────────────────────────────────

  const abandonInterview = useCallback(async () => {
    if (!sessionId) return;
    try {
      await abandonInterviewApi(sessionId);
      navigate(ROUTES.DASHBOARD);
      toast.success(
        "Interview abandoned. Credits refunded if no answers given.",
      );
    } catch {
      navigate(ROUTES.DASHBOARD);
    }
  }, [sessionId, navigate]);

  // ─── Fetch Session (page refresh recovery) ───────────────────

  const fetchSession = useCallback(async (id) => {
    setStatus("loading");
    try {
      const res = await getSession(id);
      const session = res.data.data.session;
      const currentIndex = session.currentQuestionIndex || 1;
      const activeQuestion = session.questions?.find(
        (q) => q.index === currentIndex,
      );

      setSessionId(session._id);
      setSessionData(session);
      setGreeting(
        session.messages?.find((m) => m.messageType === "greeting")?.content ??
          "",
      );
      setTotalQuestions(session.settings?.totalQuestions ?? 5);
      setQuestionIndex(currentIndex);
      setCurrentQuestion(
        activeQuestion
          ? {
              content: activeQuestion.content,
              index: activeQuestion.index,
              timeLimitSeconds: activeQuestion.timeLimitSeconds,
              isCodingQuestion: activeQuestion.isCodingQuestion,
              codingLanguage: activeQuestion.codingLanguage,
            }
          : null,
      );
      setMessages(session.messages ?? []);
      setFeedback(null);
      clearPendingQuestion();
      setIsLastQuestion(
        currentIndex >= (session.settings?.totalQuestions ?? 5),
      );
      setStatus(session.status === "active" ? "active" : "done");
    } catch (err) {
      toast.error(parseApiError(err));
      setStatus("idle");
    }
  }, []);

  // ─── Return ───────────────────────────────────────────────────

  return {
    sessionId,
    greeting,
    currentQuestion,
    messages,
    feedback,
    questionIndex,
    totalQuestions,
    isLastQuestion,
    sessionData,
    status,
    pendingNextQuestion,
    startInterview,
    submitAnswer,
    revealNextQuestion,
    endInterview,
    abandonInterview,
    fetchSession,
  };
};

export default useInterview;
