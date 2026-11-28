import { useEffect, useId, useRef } from "react";
import { MdOutlineWarning } from "react-icons/md";
import Button from "../../../components/ui/Button.jsx";

const AbandonModal = ({
  open,
  onConfirm,
  onCancel,
  loading,
  cancelLoading = false,
  confirmDisabled = false,
  title = "End Interview Early?",
  description = "Confirming will terminate this interview. Your progress will be saved. Credits are refunded only if no answers were submitted.",
  cancelLabel = "Cancel",
  error,
}) => {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return () => { if (dialog.open) dialog.close(); };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => event.preventDefault()}
      className="m-auto w-[calc(100%_-_2rem)] max-w-sm rounded-2xl p-6 backdrop:bg-black/70"
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text-primary)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/15 text-warning">
        <MdOutlineWarning size={24} aria-hidden="true" />
      </div>
      <h3 id={titleId} className="mb-2 text-center text-lg font-bold">{title}</h3>
      <p id={descriptionId} className="mb-6 text-center text-sm text-text-secondary">
        {description}
      </p>
      {error && <p role="alert" className="mb-4 text-sm text-danger">{error}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={onCancel} disabled={loading} loading={cancelLoading}>
          {cancelLabel}
        </Button>
        <Button variant="danger" fullWidth onClick={onConfirm} loading={loading} disabled={confirmDisabled || cancelLoading}>
          Confirm
        </Button>
      </div>
    </dialog>
  );
};

export default AbandonModal;
