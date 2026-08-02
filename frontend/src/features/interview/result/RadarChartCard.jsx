import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const RadarChartCard = ({ categoryScores }) => {
  const data = [
    { subject: "Communication", score: categoryScores?.communication ?? 0 },
    { subject: "Technical", score: categoryScores?.technical ?? 0 },
    { subject: "Confidence", score: categoryScores?.confidence ?? 0 },
    { subject: "Problem Solving", score: categoryScores?.problemSolving ?? 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-2xl"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        Performance Breakdown
      </h3>

      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data}>
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fontSize: 11,
              fill: "var(--color-text-secondary)",
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="var(--color-primary)"
            fill="var(--color-primary)"
            fillOpacity={0.25}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Category score list */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item) => (
          <div key={item.subject} className="flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {item.subject}
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              {item.score}/10
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RadarChartCard;
