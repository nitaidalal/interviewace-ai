import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineMic, MdOutlineMicOff } from "react-icons/md";

const VoiceButton = ({ isListening, onStart, onStop, isSupported }) => {
  if (!isSupported) return null;

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={isListening ? onStop : onStart}
      className="relative w-11 h-11 rounded-full flex items-center
        justify-center cursor-pointer transition-all duration-200 shrink-0"
      style={{
        backgroundColor: isListening
          ? "var(--color-danger)"
          : "var(--color-surface-hover)",
        border: `2px solid ${
          isListening ? "var(--color-danger)" : "var(--color-border)"
        }`,
      }}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? (
        <MdOutlineMicOff size={18} className="text-white" />
      ) : (
        <MdOutlineMic
          size={18}
          style={{ color: "var(--color-text-secondary)" }}
        />
      )}

      {/* Pulse ring when listening */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: "var(--color-danger)" }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default VoiceButton;
