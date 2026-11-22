// import { useEffect } from "react";
// import { motion } from "framer-motion";

// const AnswerInput = ({
//   value,
//   onChange,
//   isListening,
//   isSpeaking,
//   transcript,
//   isVoiceSupported,
//   disabled,
//   placeholder,
// }) => {
//   // Keep the textarea synchronized with both interim and final results.
//   // The final result can arrive after isListening becomes false.
//   useEffect(() => {
//     if (transcript) onChange(transcript);
//   }, [transcript, onChange]);

//   return (
//     <div className="flex flex-col gap-3 h-full">
//       {/* Voice unsupported warning */}
//       {!isVoiceSupported && (
//         <div
//           className="text-xs px-3 py-2 rounded-lg"
//           style={{
//             backgroundColor:
//               "color-mix(in srgb, var(--color-warning) 10%, transparent)",
//             color: "var(--color-warning)",
//           }}
//         >
//           Voice input unavailable. Use Chrome or Edge for voice support.
//         </div>
//       )}

//       {/* Textarea */}
//       <div className="relative flex-1">
//         <textarea
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={
//             disabled && isSpeaking
//               ? "AI is speaking..."
//               : isListening
//                 ? "🎤 Listening... speak your answer"
//                 : placeholder || "Type your answer here..."
//           }
//           disabled={disabled}
//           rows={6}
//           className="input-base resize-none w-full h-full font-mono text-sm
//             leading-relaxed"
//           style={{
//             minHeight: "160px",
//             borderColor: isListening ? "var(--color-danger)" : undefined,
//             opacity: disabled ? 0.6 : 1,
//             cursor: disabled ? "not-allowed" : "text",
//           }}
//         />

//         {/* Listening pulse indicator */}
//         {isListening && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="absolute bottom-3 left-3 flex items-center gap-2 text-xs"
//             style={{ color: "var(--color-danger)" }}
//           >
//             <motion.div
//               className="w-2 h-2 rounded-full bg-red-500"
//               animate={{ scale: [1, 1.4, 1] }}
//               transition={{ duration: 0.8, repeat: Infinity }}
//             />
//             Recording — click mic to stop
//           </motion.div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default AnswerInput;

import { motion } from "framer-motion";

const WAVE_BAR_COUNT = 24;

const AnswerInput = ({
  value,
  onChange,
  isRecording,
  isTranscribing,
  audioLevel = 0,
  isSpeaking,
  isVoiceSupported,
  disabled,
  placeholder,
}) => {
  const getPlaceholder = () => {
    if (isTranscribing) return "Transcribing your answer...";
    if (isRecording)
      return "🎤 Recording... tap the stop button when you finish";
    if (disabled && isSpeaking) return "AI is speaking...";
    return placeholder || "Type your answer here...";
  };

  const getVoiceHint = () => {
    if (isTranscribing) return "Converting your voice to text...";
    if (isRecording) return "Recording... tap to stop";
    return "Tap to record your answer";
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {!isVoiceSupported && (
        <div
          className="text-xs px-3 py-2 rounded-lg"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-warning) 10%, transparent)",
            color: "var(--color-warning)",
          }}
        >
          Voice recording is not supported in this browser. Please type your
          answer.
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={getPlaceholder()}
        disabled={disabled || isTranscribing}
        rows={6}
        className="input-base resize-none w-full h-full font-mono text-sm leading-relaxed"
        style={{
          minHeight: "160px",
          borderColor: isRecording ? "var(--color-danger)" : undefined,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
      />

      {(isRecording || isTranscribing) && (
        <div className="flex items-center gap-3">
          {isRecording && (
            <div className="flex h-8 items-center gap-1" aria-label="Voice volume">
              {Array.from({ length: WAVE_BAR_COUNT }, (_, index) => {
                const distance = Math.abs(index - (WAVE_BAR_COUNT - 1) / 2);
                const shape = 1 - distance / ((WAVE_BAR_COUNT - 1) / 2);
                const height = 4 + audioLevel * 24 * (0.35 + shape * 0.65);

                return (
                  <motion.span
                    key={index}
                    className="block w-1 rounded-full"
                    animate={{ height: `${height}px`, opacity: 0.45 + audioLevel * 0.55 }}
                    transition={{ duration: 0.08 }}
                    style={{ backgroundColor: "var(--color-danger)" }}
                  />
                );
              })}
            </div>
          )}
          <motion.span
            key={getVoiceHint()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs"
            style={{
              color: isRecording
                ? "var(--color-danger)"
                : "var(--color-text-muted)",
            }}
          >
            {getVoiceHint()}
          </motion.span>
        </div>
      )}
    </div>
  );
};

export default AnswerInput;