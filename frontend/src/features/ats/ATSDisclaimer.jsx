import { MdOutlineInfo } from "react-icons/md";

const ATSDisclaimer = () => (
  <div
    className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs"
    style={{
      backgroundColor:
        "color-mix(in srgb, var(--color-warning) 10%, transparent)",
      border:
        "1px solid color-mix(in srgb, var(--color-warning) 25%, transparent)",
      color: "var(--color-warning)",
    }}
  >
    <MdOutlineInfo size={15} className="shrink-0 mt-0.5" />
    <p>
      <span className="font-semibold">Disclaimer: </span>
      This is an AI-estimated compatibility score and does not represent an
      official ATS evaluation. Use it as a guide to improve your resume, not as
      a definitive pass/fail judgment.
    </p>
  </div>
);

export default ATSDisclaimer;
