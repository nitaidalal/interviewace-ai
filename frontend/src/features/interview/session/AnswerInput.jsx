import { useState, useEffect, lazy, Suspense } from "react";
import { motion as Motion } from "framer-motion";
import { MdOutlineSend } from "react-icons/md";
import VoiceButton from "./VoiceButton.jsx";
import Button from "../../../components/ui/Button.jsx";
import Spinner from "../../../components/ui/Spinner.jsx";

const MonacoEditor = lazy(() =>
  import("@monaco-editor/react").then((m) => ({ default: m.default })),
);

const MONACO_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const AnswerInput = ({
  isCoding,
  codingLanguage,
  value,
  onChange,
  onSubmit,
  loading,
  isListening,
  isSpeaking,
  transcript,
  onVoiceStart,
  onVoiceStop,
  isVoiceSupported,
  disabled,
}) => {
  const [monacoLang, setMonacoLang] = useState(
    codingLanguage?.toLowerCase() || "javascript",
  );

  // Sync transcript to value when listening
  useEffect(() => {
    if (isListening && transcript) {
      onChange(transcript);
    }
  }, [transcript, isListening]);

  if (isCoding) {
    return (
      <div className="flex flex-col gap-3">
        {/* Language selector */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Language
          </span>
          <select
            value={monacoLang}
            onChange={(e) => setMonacoLang(e.target.value)}
            className="input-base w-auto py-1 px-3 text-xs"
          >
            {MONACO_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Monaco Editor */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--color-border)", height: "500px" }}
        >
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center">
                <Spinner size="md" />
              </div>
            }
          >
            <MonacoEditor
              height="500px"
              language={monacoLang}
              value={value}
              onChange={(v) => onChange(v || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                wordWrap: "on",
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </Suspense>
        </div>

        <Button
          fullWidth
          onClick={onSubmit}
          loading={loading}
          disabled={disabled || !value?.trim()}
          className="gap-2"
        >
          <MdOutlineSend size={16} />
          Submit Solution
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
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
          Voice input is not supported in your browser. Use Chrome or Edge for
          voice.
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          isListening
            ? "🎤 Listening... speak your answer"
            : "Type your answer here..."
        }
        disabled={disabled || isSpeaking}
        rows={12}
        spellCheck={false}
        className="input-base resize-none font-mono text-sm"
        style={{
          borderColor: isListening ? "var(--color-danger)" : undefined,
        }}
      />

      {/* Voice transcript indicator */}
      {isListening && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs flex items-center gap-2"
          style={{ color: "var(--color-danger)" }}
        >
          <Motion.div
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          Recording... click mic to stop
        </Motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <VoiceButton
          isListening={isListening}
          onStart={onVoiceStart}
          onStop={onVoiceStop}
          isSupported={isVoiceSupported}
        />
        <Button
          fullWidth
          onClick={onSubmit}
          loading={loading}
          disabled={disabled}
          className="gap-2"
        >
          <MdOutlineSend size={16} />
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

export default AnswerInput;
