import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineSend } from "react-icons/md";
import AnswerInput from "./AnswerInput.jsx";
import FeedbackBubble from "./FeedbackBubble.jsx";
import CodeEditorModal from "./CodeEditorModal.jsx";
import Button from "../../../components/ui/Button.jsx";

/**
 * AnswerZone — controls what shows in the answer slot.
 *
 * States:
 *   'answering'  → textarea or Monaco, submit button active
 *   'submitting' → textarea disabled, submit button loading
 *   'feedback'   → FeedbackBubble replaces textarea, no submit
 *   'speaking'   → textarea disabled (AI speaking question)
 *   'ended'      → nothing shown
 */
const AnswerZone = ({
  zoneState,
  isCoding,
  codingLanguage,
  answer,
  onAnswerChange,
  onSubmit,
  feedback,
  isListening,
  isSpeaking,
  transcript,
  isVoiceSupported,
}) => {
  const isAnswering = zoneState === "answering";
  const isSubmitting = zoneState === "submitting";
  const isFeedback = zoneState === "feedback";
  const isSpeakingState = zoneState === "speaking";

  const inputDisabled = isSubmitting || isSpeakingState;
  const showInput = isAnswering || isSubmitting || isSpeakingState;
  const showFeedback = isFeedback;
  const showSubmit = (isAnswering || isSubmitting) && !isFeedback;

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Answer slot — fixed min height to prevent layout shift */}
      <div style={{ minHeight: "220px" }} className="flex flex-col">
        <AnimatePresence mode="wait">
          {showFeedback ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              <FeedbackBubble
                feedback={feedback?.text}
                score={feedback?.score}
              />
            </motion.div>
          ) : showInput ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              {isCoding ? (
                <CodeEditorModal
                  value={answer}
                  onChange={onAnswerChange}
                  codingLanguage={codingLanguage}
                  onSubmit={onSubmit}
                  loading={isSubmitting}
                  disabled={inputDisabled}
                />
              ) : (
                <AnswerInput
                  value={answer}
                  onChange={onAnswerChange}
                  isListening={isListening}
                  isSpeaking={isSpeakingState}
                  transcript={transcript}
                  isVoiceSupported={isVoiceSupported}
                  disabled={inputDisabled}
                />
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Submit button — only for text answers */}
      {showSubmit && !isCoding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Button
            fullWidth
            size="lg"
            onClick={onSubmit}
            loading={isSubmitting}
            disabled={inputDisabled}
            className="gap-2"
          >
            <MdOutlineSend size={16} />
            Submit Answer
          </Button>
        </motion.div>
      )}

      {/* Coding submit — shown below compact editor */}
      {showSubmit && isCoding && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button
            fullWidth
            size="lg"
            onClick={onSubmit}
            loading={isSubmitting}
            disabled={inputDisabled || !answer?.trim()}
            className="gap-2"
          >
            <MdOutlineSend size={16} />
            Submit Solution
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AnswerZone;
