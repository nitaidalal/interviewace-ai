import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import SetupStepper from "../features/interview/setup/SetupStepper.jsx";
import ModeSelector from "../features/interview/setup/ModeSelector.jsx";
import RoleSelector from "../features/interview/setup/RoleSelector.jsx";
import StackSelector from "../features/interview/setup/StackSelector.jsx";
import ExperienceSelector, {
  mapYearsToLevel,
} from "../features/interview/setup/ExperienceSelector.jsx";
import DifficultySelector from "../features/interview/setup/DifficultySelector.jsx";
import ResumeUpload from "../features/interview/setup/ResumeUpload.jsx";
import InterviewSummary from "../features/interview/setup/InterviewSummary.jsx";
import Button from "../components/ui/Button.jsx";
import useInterview from "../hooks/useInterview.js";

const STEPS = {
  MODE: 1,
  ROLE: 2,
  STACK: 3,
  EXPERIENCE: 4,
  DIFFICULTY: 5,
  RESUME: 6,
  SUMMARY: 7,
};

const HR_STEPS = {
  MODE: 1,
  EXPERIENCE: 2,
  DIFFICULTY: 3,
  RESUME: 4,
  SUMMARY: 5,
};

const getActiveSteps = (mode) => (mode === "hr" ? HR_STEPS : STEPS);

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

const InterviewSetupPage = () => {
  const user = useSelector((state) => state.auth.user);
  const isPro = user?.subscription?.plan === "pro";
  const { startInterview, status } = useInterview();

  const [step, setStep] = useState(STEPS.MODE);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({
    mode: "",
    role: "",
    stack: "",
    framework: "",
    database: "",
    bundle: "",
    dsaLanguage: "",
    subjects: [],
    addons: [],
    experienceYears: 0,
    difficulty: "",
    resumeText: null,
  });

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  // Skip Role and Stack for HR
  const getNextStep = (current) => {
    const activeSteps = getActiveSteps(form.mode);

    if (current === activeSteps.MODE && form.mode === "hr") {
      return activeSteps.EXPERIENCE;
    }
    if (current === activeSteps.MODE) return activeSteps.ROLE;
    if (current === activeSteps.ROLE) return activeSteps.STACK;
    if (current === activeSteps.STACK) return activeSteps.EXPERIENCE;
    return current + 1;
  };

  const getPrevStep = (current) => {
    const activeSteps = getActiveSteps(form.mode);

    if (current === activeSteps.EXPERIENCE && form.mode === "hr") {
      return activeSteps.MODE;
    }
    if (current === activeSteps.STACK) return activeSteps.ROLE;
    if (current === activeSteps.ROLE) return activeSteps.MODE;
    return current - 1;
  };

  const handleNext = () => {
    setDirection(1);
    setStep(getNextStep(step));
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(getPrevStep(step));
  };

  const activeSteps = getActiveSteps(form.mode);

  const canProceed = () => {
    switch (step) {
      case activeSteps.MODE:
        return !!form.mode;
      case activeSteps.ROLE:
        return !!form.role;
      case activeSteps.STACK:
        if (form.role === "frontend") return !!form.stack;
        if (form.role === "backend") return !!form.stack && !!form.database;
        if (form.role === "fullstack") return !!form.bundle;
        if (form.role === "dsa") return !!form.dsaLanguage;
        if (form.role === "core_cs") return form.subjects?.length > 0;
        return true;
      case activeSteps.EXPERIENCE:
        return form.experienceYears >= 0;
      case activeSteps.DIFFICULTY:
        return !!form.difficulty;
      case activeSteps.RESUME:
        return true;
      default:
        return true;
    }
  };

  const buildSettings = () => {
    const level = mapYearsToLevel(form.experienceYears);
    const timePerQuestion = { easy: 60, medium: 90, hard: 120 }[
      form.difficulty
    ];
    const totalQuestions = isPro ? 10 : 5;
    const estimatedMinutes = isPro ? 20 : 10;

    return {
      mode: form.mode,
      difficulty: form.difficulty,
      experience: { years: form.experienceYears, level: level.value },
      role: form.mode === "technical" ? form.role : null,
      framework: form.role === "frontend" ? form.stack : null,
      stack: ["backend"].includes(form.role) ? form.stack : null,
      database: form.role === "backend" ? form.database : null,
      bundle: form.role === "fullstack" ? form.bundle : null,
      dsaLanguage: form.role === "dsa" ? form.dsaLanguage : null,
      subjects: form.role === "core_cs" ? form.subjects : [],
      addons: form.addons,
      webcamEnabled: true,
      resumeText: form.resumeText,
      timePerQuestion,
      totalQuestions,
      estimatedMinutes,
    };
  };

  const handleStart = () => {
    const settings = buildSettings();
    startInterview(settings);
  };

  const stepTitles = form.mode === "hr"
    ? {
        [activeSteps.MODE]: "Choose Interview Type",
        [activeSteps.EXPERIENCE]: "Your Experience",
        [activeSteps.DIFFICULTY]: "Set Difficulty",
        [activeSteps.RESUME]: "Upload Resume (Optional)",
        [activeSteps.SUMMARY]: "Ready to Start?",
      }
    : {
        [activeSteps.MODE]: "Choose Interview Type",
        [activeSteps.ROLE]: "Select Your Role",
        [activeSteps.STACK]: "Choose Your Stack",
        [activeSteps.EXPERIENCE]: "Your Experience",
        [activeSteps.DIFFICULTY]: "Set Difficulty",
        [activeSteps.RESUME]: "Upload Resume (Optional)",
        [activeSteps.SUMMARY]: "Ready to Start?",
      };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Setup Interview
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Configure your AI mock interview session
        </p>
      </div>

      {/* Stepper */}
      <SetupStepper currentStep={step} mode={form.mode} />

      {/* Step title */}
      <motion.h2
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg font-semibold text-center mb-6"
        style={{ color: "var(--color-text-primary)" }}
      >
        {stepTitles[step]}
      </motion.h2>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {step === activeSteps.MODE && (
            <ModeSelector
              selected={form.mode}
              onSelect={(v) => {
                setForm((p) => ({ ...p, mode: v }));
              }}
            />
          )}

          {form.mode !== "hr" && step === activeSteps.ROLE && (
            <RoleSelector
              selected={form.role}
              onSelect={(v) => setForm((p) => ({ ...p, role: v }))}
            />
          )}

          {form.mode !== "hr" && step === activeSteps.STACK && (
            <StackSelector
              role={form.role}
              stack={
                form.role === "frontend"
                  ? form.stack
                  : form.role === "backend"
                    ? form.stack
                    : form.role === "fullstack"
                      ? form.bundle
                      : form.role === "dsa"
                        ? form.dsaLanguage
                        : null
              }
              database={form.database}
              subjects={form.subjects}
              onChange={(updates) => {
                if (form.role === "frontend") {
                  setForm((p) => ({ ...p, stack: updates.stack }));
                } else if (form.role === "backend") {
                  setForm((p) => ({
                    ...p,
                    stack: updates.stack,
                    database: updates.database,
                  }));
                } else if (form.role === "fullstack") {
                  setForm((p) => ({ ...p, bundle: updates.stack }));
                } else if (form.role === "dsa") {
                  setForm((p) => ({ ...p, dsaLanguage: updates.stack }));
                } else if (form.role === "core_cs") {
                  setForm((p) => ({ ...p, subjects: updates.subjects }));
                }
              }}
            />
          )}

          {step === activeSteps.EXPERIENCE && (
            <ExperienceSelector
              years={form.experienceYears}
              onChange={(y) => setForm((p) => ({ ...p, experienceYears: y }))}
            />
          )}

          {step === activeSteps.DIFFICULTY && (
            <DifficultySelector
              selected={form.difficulty}
              onSelect={(v) => setForm((p) => ({ ...p, difficulty: v }))}
            />
          )}

          {step === activeSteps.RESUME && (
            <ResumeUpload
              onResumeText={(text) => {
                setForm((p) => ({ ...p, resumeText: text }));
                goNext();
              }}
              onSkip={goNext}
            />
          )}

          {step === activeSteps.SUMMARY && (
            <InterviewSummary
              settings={{
                ...form,
                timePerQuestion: { easy: 60, medium: 90, hard: 120 }[
                  form.difficulty
                ],
                totalQuestions: isPro ? 10 : 5,
                estimatedMinutes: isPro ? 20 : 10,
              }}
              onStart={handleStart}
              loading={status === "loading"}
              isPro={isPro}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons — hidden on resume + summary steps */}
      {step !== activeSteps.RESUME && step !== activeSteps.SUMMARY && (
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={step === activeSteps.MODE}
          >
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            {step === activeSteps.DIFFICULTY ? "Next → Resume" : "Continue"}
          </Button>
        </div>
      )}

      {step === activeSteps.SUMMARY && (
        <div className="flex justify-center mt-4">
          <Button variant="ghost" onClick={handleBack}>
            ← Go Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default InterviewSetupPage;
