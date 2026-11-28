import { motion } from "framer-motion";
import {
  MdOutlineMic,
  MdOutlineMicOff,
  MdOutlineVideocam,
  MdOutlineVideocamOff,
  MdOutlineCallEnd,
} from "react-icons/md";
import AIPresenter from "./AIPresenter.jsx";
import { useSelector } from "react-redux";

const ControlButton = ({ onClick, active, danger, icon: Icon, label }) => (
  <div className="flex flex-col items-center gap-1.5">
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="w-12 h-12 rounded-full flex items-center justify-center
        cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: danger
          ? "var(--color-danger)"
          : active
            ? "color-mix(in srgb, var(--color-primary) 20%, transparent)"
            : "var(--color-surface-hover)",
        border: `2px solid ${
          danger
            ? "var(--color-danger)"
            : active
              ? "var(--color-primary)"
              : "var(--color-border)"
        }`,
        color: danger
          ? "white"
          : active
            ? "var(--color-primary)"
            : "var(--color-text-secondary)",
      }}
      title={label}
    >
      <Icon size={20} />
    </motion.button>
    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
      {label}
    </span>
  </div>
);

const LeftPanel = ({
  aiState,
  videoRef,
  webcamEnabled,
  webcamDenied,
  webcamLoading,
  onToggleWebcam,
  isListening,
  onToggleMic,
  isVoiceSupported,
  voiceError,
  onEndCall,
}) => {
  const user = useSelector((state) => state.auth.user);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="flex flex-col gap-4 h-full min-h-0 p-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* AI Avatar — large slot for future real image */}
      <div
        className="rounded-2xl overflow-hidden flex-1 min-h-0 flex items-center
          justify-center relative"
        style={{
          backgroundColor: "var(--color-media-bg)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* 
          To use real image later:
          Replace AIPresenter with:
          <img src="/ai-avatar.png" className="w-full h-full object-cover" />
          and keep wave overlay as absolute positioned div
        */}
        <AIPresenter aiState={aiState} large />
      </div>

      {/* User webcam */}
      <div
        className="rounded-2xl overflow-hidden relative flex-1 min-h-0"
        style={{
          backgroundColor: "var(--color-media-bg)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Live video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ display: webcamEnabled ? "block" : "none" }}
        />

        {/* Cam off state */}
        {!webcamEnabled && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center
                text-lg font-bold text-white bg-avatar-gradient"
            >
              {initials}
            </div>
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {webcamDenied ? "Camera blocked" : "Camera off"}
            </span>
          </div>
        )}

        {/* Recording dot */}
        {webcamEnabled && (
          <div className="absolute top-2 right-2">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        )}

        {/* User name label */}
        <div
          className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-xs
            font-medium"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
          }}
        >
          {user?.name?.split(" ")[0] ?? "You"}
        </div>
      </div>

      {/* Controls */}
      <div
        className="flex shrink-0 items-center justify-center gap-6 pt-2"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {isVoiceSupported && (
          <ControlButton
            icon={isListening ? MdOutlineMic : MdOutlineMicOff}
            label={isListening ? "Mute" : "Unmute"}
            active={isListening}
            onClick={onToggleMic}
          />
        )}
        <ControlButton
          icon={webcamEnabled ? MdOutlineVideocam : MdOutlineVideocamOff}
          label={webcamEnabled ? "Cam On" : "Cam Off"}
          active={webcamEnabled}
          onClick={onToggleWebcam}
        />
        <ControlButton
          icon={MdOutlineCallEnd}
          label="End"
          danger
          onClick={onEndCall}
        />
      </div>
      {voiceError && (
        <p role="alert" className="text-xs text-center" style={{ color: "var(--color-danger)" }}>
          {voiceError}
        </p>
      )}
    </div>
  );
};

export default LeftPanel;
