import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdOutlineVideoCall, MdOutlineArrowForward } from "react-icons/md";
import { getHistory } from "../api/interviewApi.js";
import Spinner from "../components/ui/Spinner.jsx";
import Badge from "../components/ui/Badge.jsx";
import { parseApiError } from "../utils/errorParser.js";
import toast from "react-hot-toast";

const statusVariant = {
  completed: "success",
  interrupted: "warning",
  abandoned: "danger",
  active: "primary",
};

const InterviewHistoryPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchHistory = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getHistory(p, limit);
      const data = res.data.data;
      setSessions(data.sessions);
      setTotal(data.total);
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDuration = (s) => {
    if (!s) return "—";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto flex flex-col gap-6"
    >
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Interview History
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {total} session{total !== 1 ? "s" : ""} total
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : sessions.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <MdOutlineVideoCall
            size={48}
            className="mx-auto mb-4"
            style={{ color: "var(--color-text-muted)" }}
          />
          <p
            className="text-base font-medium mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            No interviews yet
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Start your first mock interview to see results here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              onClick={() =>
                s.status === "completed" &&
                navigate(`/dashboard/interview/${s._id}/result`)
              }
              className="flex items-center gap-4 p-4 rounded-2xl transition-all
                duration-200"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                cursor: s.status === "completed" ? "pointer" : "default",
              }}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl bg-brand-gradient
                flex items-center justify-center shrink-0"
              >
                <MdOutlineVideoCall size={20} className="text-white" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {s.settings?.mode === "hr"
                      ? "HR Interview"
                      : `${s.settings?.role ?? "Technical"} — ${s.settings?.difficulty}`}
                  </span>
                  <Badge variant={statusVariant[s.status] ?? "muted"}>
                    {s.status}
                  </Badge>
                </div>
                <div
                  className="flex items-center gap-3 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <span>{formatDate(s.startedAt)}</span>
                  <span>·</span>
                  <span>{formatDuration(s.actualDuration)}</span>
                  {s.evaluation?.finalScore != null && (
                    <>
                      <span>·</span>
                      <span
                        className="font-semibold"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {s.evaluation.finalScore}/10
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Arrow */}
              {s.status === "completed" && (
                <MdOutlineArrowForward
                  size={18}
                  style={{ color: "var(--color-text-muted)" }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium
              transition-colors disabled:opacity-50 cursor-pointer"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            Previous
          </button>
          <span
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / limit)}
            className="px-4 py-2 rounded-lg text-sm font-medium
              transition-colors disabled:opacity-50 cursor-pointer"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default InterviewHistoryPage;
