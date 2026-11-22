import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineClose, MdOutlineOpenInFull } from "react-icons/md";
import { MdOutlineSend } from "react-icons/md";
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

const EditorContent = ({ value, onChange, language, height = "100%" }) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center" style={{ height }}>
        <Spinner size="md" />
      </div>
    }
  >
    <MonacoEditor
      height={height}
      language={language}
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
        padding: { top: 12, bottom: 12 },
        fontFamily: "Fira Code, monospace",
      }}
    />
  </Suspense>
);

const CodeEditorModal = ({
  value,
  onChange,
  codingLanguage,
  onSubmit,
  loading,
  disabled,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [monacoLang, setMonacoLang] = useState(
    codingLanguage?.toLowerCase() || "javascript",
  );

  return (
    <>
      {/* Compact editor */}
      <div className="flex flex-col gap-2">
        {/* Language selector + expand button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              Language:
            </span>
            <select
              value={monacoLang}
              onChange={(e) => setMonacoLang(e.target.value)}
              className="input-base py-1 px-2 text-xs w-auto"
              style={{ width: "fit-content" }}
            >
              {MONACO_LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1.5 text-xs font-medium
              cursor-pointer transition-colors duration-200 px-3 py-1.5
              rounded-lg border"
            style={{
              color: "var(--color-text-secondary)",
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface-hover)",
            }}
          >
            <MdOutlineOpenInFull size={13} />
            Expand Editor
          </button>
        </div>

        {/* Compact Monaco */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid var(--color-border)",
            height: "220px",
          }}
        >
          <EditorContent
            value={value}
            onChange={onChange}
            language={monacoLang}
            height="220px"
          />
        </div>
      </div>

      {/* Full screen modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ backgroundColor: "#1e1e1e" }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-3 shrink-0"
              style={{
                backgroundColor: "#2d2d2d",
                borderBottom: "1px solid #3d3d3d",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">
                  Code Editor
                </span>
                <select
                  value={monacoLang}
                  onChange={(e) => setMonacoLang(e.target.value)}
                  className="text-xs rounded-lg px-2 py-1 border outline-none"
                  style={{
                    backgroundColor: "#3d3d3d",
                    color: "white",
                    borderColor: "#555",
                  }}
                >
                  {MONACO_LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    setExpanded(false);
                    onSubmit();
                  }}
                  loading={loading}
                  disabled={disabled || !value?.trim()}
                  size="sm"
                  className="gap-1.5"
                >
                  <MdOutlineSend size={14} />
                  Submit Solution
                </Button>

                <button
                  onClick={() => setExpanded(false)}
                  className="p-2 rounded-lg cursor-pointer transition-colors"
                  style={{ color: "#aaa" }}
                >
                  <MdOutlineClose size={18} />
                </button>
              </div>
            </div>

            {/* Full Monaco */}
            <div className="flex-1 overflow-hidden">
              <EditorContent
                value={value}
                onChange={onChange}
                language={monacoLang}
                height="100%"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CodeEditorModal;
