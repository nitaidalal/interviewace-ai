import { useEffect } from "react";
import { motion } from "framer-motion";

const AnswerInput = ({
  value,
  onChange,
  isListening,
  isSpeaking,
  transcript,
  isVoiceSupported,
  disabled,
  placeholder,
}) => {
  // Keep the textarea synchronized with both interim and final results.
  // The final result can arrive after isListening becomes false.
  useEffect(() => {
    if (transcript) onChange(transcript);
  }, [transcript, onChange]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Voice unsupported warning */}
      {!isVoiceSupported && (
        <div
          className="text-xs px-3 py-2 rounded-lg"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-warning) 10%, transparent)",
            color: "var(--color-warning)",
          }}
        >
          Voice input unavailable. Use Chrome or Edge for voice support.
        </div>
      )}

      {/* Textarea */}
      <div className="relative flex-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            disabled && isSpeaking
              ? "AI is speaking..."
              : isListening
                ? "🎤 Listening... speak your answer"
                : placeholder || "Type your answer here..."
          }
          disabled={disabled}
          rows={6}
          className="input-base resize-none w-full h-full font-mono text-sm
            leading-relaxed"
          style={{
            minHeight: "160px",
            borderColor: isListening ? "var(--color-danger)" : undefined,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? "not-allowed" : "text",
          }}
        />

        {/* Listening pulse indicator */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-3 left-3 flex items-center gap-2 text-xs"
            style={{ color: "var(--color-danger)" }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            Recording — click mic to stop
          </motion.div>
        )}
      </div>

    </div>
  );
};

export default AnswerInput;