import { motion as Motion, AnimatePresence } from "framer-motion";
import { MdOutlineWarning } from "react-icons/md";
import Button from "../../../components/ui/Button.jsx";

const AbandonModal = ({ open, onConfirm, onCancel, loading }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={onCancel}
          />

          {/* Modal */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4
              pointer-events-none"
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6 pointer-events-auto"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center
                  mb-4 mx-auto"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-warning) 15%, transparent)",
                }}
              >
                <MdOutlineWarning
                  size={24}
                  style={{ color: "var(--color-warning)" }}
                />
              </div>

              <h3
                className="text-lg font-bold text-center mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                End Interview Early?
              </h3>
              <p
                className="text-sm text-center mb-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Your progress will be saved. Credits will be refunded only if
                you haven't answered any questions.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={onCancel}
                  disabled={loading}
                >
                  Continue Interview
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={onConfirm}
                  loading={loading}
                >
                  End Interview
                </Button>
              </div>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AbandonModal;
