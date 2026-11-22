import { useEffect, useState } from "react";
import {motion as  Motion, AnimatePresence } from "framer-motion";
import { MdOutlineRefresh, MdOutlineHistory } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import useATS from "../hooks/useATS.js";
import ResumeDropzone from "../features/ats/ResumeDropzone.jsx";
import ATSScoreRing from "../features/ats/ATSScoreRing.jsx";
import ATSReportGrid from "../features/ats/ATSReportGrid.jsx";
import ATSInsights from "../features/ats/ATSInsights.jsx";
import ATSHistoryList from "../features/ats/ATSHistoryList.jsx";
import ATSDisclaimer from "../features/ats/ATSDisclaimer.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Button from "../components/ui/Button.jsx";

const ATSPage = () => {
  const {
    analysis,
    history,
    total,
    loading,
    historyLoading,
    analyzing,
    analyze,
    fetchHistory,
    fetchById,
    reset,
  } = useATS();

  const [showHistory, setShowHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handleSelectHistory = async (id) => {
    await fetchById(id);
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto flex flex-col gap-6 px-4 py-6"
    >
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold flex items-center gap-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            <HiSparkles style={{ color: "var(--color-primary)" }} />
            ATS Resume Analyzer
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Upload your resume and get AI-powered feedback to improve it
          </p>
        </div>

        <div className="flex items-center gap-2">
          {analysis && (
            <Button
              variant="secondary"
              size="sm"
              onClick={reset}
              className="gap-1.5"
            >
              <MdOutlineRefresh size={15} />
              Analyze New
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowHistory((v) => !v)}
            className="gap-1.5"
          >
            <MdOutlineHistory size={15} />
            History {total > 0 && `(${total})`}
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <ATSDisclaimer />

      {/* History panel */}
      <AnimatePresence>
        {showHistory && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Previous Analyses
              </h3>
              <ATSHistoryList
                history={history}
                onSelect={handleSelectHistory}
                loading={historyLoading}
              />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {loading ? (
          // ── Loading full report ────────────────────────────
          <Motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[400px] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" />
              <p style={{ color: "var(--color-text-secondary)" }}>
                Loading analysis...
              </p>
            </div>
          </Motion.div>
        ) : !analysis ? (
          // ── Upload zone ────────────────────────────────────
          <Motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-lg mx-auto w-full"
          >
            <ResumeDropzone onAnalyze={analyze} analyzing={analyzing} />
          </Motion.div>
        ) : (
          // ── Analysis results ───────────────────────────────
          <Motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-8"
          >
            {/* Score + overview */}
            <div
              className="flex flex-col sm:flex-row items-center gap-8
                p-6 rounded-2xl"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* Score ring */}
              <div className="shrink-0">
                <ATSScoreRing score={analysis.atsScore} />
              </div>

              {/* Quick stats */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {[
                  {
                    label: "Strengths",
                    value: analysis.strengths?.length ?? 0,
                    color: "var(--color-success)",
                  },
                  {
                    label: "Improvements",
                    value: analysis.improvements?.length ?? 0,
                    color: "var(--color-warning)",
                  },
                  {
                    label: "Missing Keywords",
                    value: analysis.missingKeywords?.length ?? 0,
                    color: "var(--color-primary)",
                  },
                  {
                    label: "Sections Scored",
                    value: Object.keys(analysis.atsReport ?? {}).length,
                    color: "var(--color-text-secondary)",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-1
                      p-3 rounded-xl text-center"
                    style={{
                      backgroundColor: "var(--color-surface-hover)",
                    }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section scores grid */}
            <ATSReportGrid atsReport={analysis.atsReport} />

            {/* Strengths, improvements, keywords */}
            <ATSInsights
              strengths={analysis.strengths}
              improvements={analysis.improvements}
              missingKeywords={analysis.missingKeywords}
            />

            {/* Analyze another */}
            <div className="flex justify-center pb-4">
              <Button variant="secondary" onClick={reset} className="gap-2">
                <MdOutlineRefresh size={16} />
                Analyze Another Resume
              </Button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

export default ATSPage;
