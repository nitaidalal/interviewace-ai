import { useEffect } from "react";
import { motion } from "framer-motion";
import { MdOutlineVideocamOff } from "react-icons/md";

const WebcamFeed = ({ videoRef, enabled, denied, loading, onRequest }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-32 h-24 rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "2px solid var(--color-border)",
      }}
    >
      {/* Live video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ display: enabled ? "block" : "none" }}
      />

      {/* No webcam state */}
      {!enabled && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
          <MdOutlineVideocamOff
            size={20}
            style={{ color: "var(--color-text-muted)" }}
          />
          <span
            className="text-xs text-center px-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            {denied ? "Camera\ndenied" : loading ? "Starting..." : "No camera"}
          </span>
        </div>
      )}

      {/* Recording dot */}
      {enabled && (
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
          <motion.div
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default WebcamFeed;
