import { useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../api/axiosInstance.js";
import {
  MdOutlineUploadFile,
  MdOutlineDelete,
  MdOutlineDescription,
} from "react-icons/md";
import { HiArrowRight } from "react-icons/hi";

const ResumeUpload = ({ onResumeText, onSkip }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (selected) => {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Only PDF files are supported");
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      setError("File size must be under 2MB");
      return;
    }

    setFile(selected);
    setError("");
    setParsing(true);

    try {
      // Send to backend for parsing
      const formData = new FormData();
      formData.append("resume", selected);

      // We'll use a simple fetch here since we just need the text
      const res = await axiosInstance.post("/users/resume/parse", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onResumeText(res.data.data.text);
    } catch {
      // If parsing fails, just skip resume
      setError("Failed to parse resume. You can skip this step.");
      onResumeText(null);
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Upload your resume so the AI can ask personalized questions based on
          your projects and experience.
        </p>
      </div>

      {/* Drop zone */}
      <AnimatePresence mode="wait">
        {!file ? (
          <Motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed rounded-2xl p-10 text-center
              cursor-pointer transition-all duration-200"
            style={{ borderColor: "var(--color-border)" }}
            whileHover={{
              borderColor: "var(--color-primary)",
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 5%, transparent)",
            }}
          >
            <MdOutlineUploadFile
              size={40}
              className="mx-auto mb-3"
              style={{ color: "var(--color-text-muted)" }}
            />
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              Drop your resume here or click to browse
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              PDF only · Max 2MB
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </Motion.div>
        ) : (
          <Motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 15%, transparent)", //
              }}
            >
              <MdOutlineDescription
                size={24}
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--color-text-primary)" }}
              >
                {file.name}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {parsing ? "Parsing resume..." : "✅ Resume ready"}
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                onResumeText(null);
              }}
              className="p-2 rounded-lg cursor-pointer"
              style={{ color: "var(--color-danger)" }}
            >
              <MdOutlineDelete size={18} />
            </button>
          </Motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p
          className="text-sm text-center"
          style={{ color: "var(--color-danger)" }}
        >
          {error}
        </p>
      )}

      {/* Skip */}
      <button
        onClick={onSkip}
        className="flex items-center justify-center gap-2 text-sm
          font-medium cursor-pointer transition-colors duration-200 mx-auto"
        style={{ color: "var(--color-text-muted)" }}
      >
        Skip this step
        <HiArrowRight size={14} />
      </button>
    </div>
  );
};

export default ResumeUpload;
