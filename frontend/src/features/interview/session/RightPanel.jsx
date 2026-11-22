import { motion } from "framer-motion";
import ProgressHeader from "./ProgressHeader.jsx";
import QuestionCard from "./QuestionCard.jsx";
import AnswerZone from "./AnswerZone.jsx";

const RightPanel = ({
  // Progress
  questionIndex,
  totalQuestions,
  timeLimit,
  onTimeout,
  timerPaused,
  timerKey,

  // Question
  currentQuestion,
  questionVisible,

  // Answer zone
  zoneState,
  answer,
  onAnswerChange,
  onSubmit,
  feedback,
  isRecording,
  isTranscribing,
  audioLevel,
  isSpeaking,
  isVoiceSupported,
}) => {
  return (
    <div className="flex flex-col h-full p-6 gap-5 overflow-y-auto">
      {/* Progress header */}
      <ProgressHeader
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        timeLimit={timeLimit}
        onTimeout={onTimeout}
        paused={timerPaused}
        timerKey={timerKey}
      />

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />

      {/* Question card */}
      {questionVisible && currentQuestion && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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

      {/* Answer zone — fills remaining space */}
      {questionVisible && zoneState !== "ended" && (
        <AnswerZone
          zoneState={zoneState}
          isCoding={currentQuestion?.isCodingQuestion}
          codingLanguage={currentQuestion?.codingLanguage}
          answer={answer}
          onAnswerChange={onAnswerChange}
          onSubmit={onSubmit}
          feedback={feedback}
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          audioLevel={audioLevel}
          isSpeaking={isSpeaking}
          isVoiceSupported={isVoiceSupported}
        />
      )}
    </div>
  );
};

export default RightPanel;
