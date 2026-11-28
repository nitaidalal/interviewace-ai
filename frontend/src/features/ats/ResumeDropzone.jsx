import { useRef, useState } from "react";
import {motion as  Motion, AnimatePresence } from "framer-motion";
import {
  MdOutlineUploadFile,
  MdOutlineDescription,
  MdOutlineDelete,
  MdOutlineAutoAwesome,
} from "react-icons/md";
import { RiCoinLine } from "react-icons/ri";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

const ResumeDropzone = ({ onAnalyze, analyzing }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (f) => {
    if (!f) return "No file selected";
    if (f.type !== "application/pdf") return "Only PDF files are supported";
    if (f.size > 2 * 1024 * 1024) return "File size must be under 2MB";
    return null;
  };

  const handleFile = (f) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (!file) return;
    onAnalyze(file);
  };

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {!file ? (
          // ── Drop zone ──────────────────────────────────────
          <Motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-4
              rounded-2xl cursor-pointer transition-all duration-200 py-14 px-6"
            style={{
              border: `2px dashed ${
                dragging ? "var(--color-primary)" : "var(--color-border)"
              }`,
              backgroundColor: dragging
                ? "color-mix(in srgb, var(--color-primary) 5%, transparent)"
                : "var(--color-surface)",
            }}
          >
            <Motion.div
              animate={{ y: dragging ? -6 : 0 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-16 h-16 rounded-2xl bg-brand-gradient
                flex items-center justify-center"
            >
              <MdOutlineUploadFile size={32} className="text-white" />
            </Motion.div>

            <div className="text-center">
              <p
                className="text-base font-semibold mb-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                {dragging ? "Drop your resume here" : "Upload your resume"}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Drag & drop or click to browse
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                PDF only · Max 2MB
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </Motion.div>
        ) : (
          // ── File selected ──────────────────────────────────
          <Motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center
                justify-center shrink-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 15%, transparent)",
              }}
            >
              <MdOutlineDescription
                size={24}
                style={{ color: "var(--color-primary)" }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--color-text-primary)" }}
              >
                {file.name}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-text-muted)" }}
              >
                {(file.size / 1024).toFixed(1)} KB · PDF
              </p>
            </div>

            <button
              onClick={() => setFile(null)}
              disabled={analyzing}
              className="p-2 rounded-lg cursor-pointer
                transition-colors duration-200 disabled:opacity-50"
              style={{ color: "var(--color-danger)" }}
            >
              <MdOutlineDelete size={18} />
            </button>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-center"
          style={{ color: "var(--color-danger)" }}
        >
          {error}
        </Motion.p>
      )}

      {/* Credit cost notice */}
      <div
        className="flex items-center justify-center gap-2 text-xs py-2
          rounded-xl"
        style={{
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text-muted)",
          border: "1px solid var(--color-border)",
        }}
      >
        <RiCoinLine style={{ color: "var(--color-primary)" }} />
        This analysis costs
        <span
          className="font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          10 credits
        </span>
      </div>

      {/* Analyze button */}
      <Button
        fullWidth
        size="lg"
        onClick={handleSubmit}
        disabled={!file || analyzing}
        loading={analyzing}
        className="gap-2"
      >
        {analyzing ? (
          "Analyzing your resume..."
        ) : (
          <>
            <MdOutlineAutoAwesome size={18} />
            Analyze with AI
          </>
        )}
      </Button>
    </div>
  );
};

export default ResumeDropzone;
