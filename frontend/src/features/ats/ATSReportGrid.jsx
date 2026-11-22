import ATSSectionCard from "./ATSSectionCard.jsx";

const ATSReportGrid = ({ atsReport }) => {
  if (!atsReport) return null;

  const entries = Object.entries(atsReport);

  return (
    <div className="flex flex-col gap-4">
      <h3
        className="text-base font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        Section Scores
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(([key, data], i) => (
          <ATSSectionCard key={key} sectionKey={key} data={data} index={i} />
        ))}
      </div>
    </div>
  );
};

export default ATSReportGrid;
