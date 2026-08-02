import { useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";

const CountdownTimer = ({ seconds, onTimeout, paused = false }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef(null);
  const hasTimedOut = useRef(false);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    setTimeLeft(seconds);
    hasTimedOut.current = false;
  }, [seconds]);

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (!hasTimedOut.current) {
            hasTimedOut.current = true;
            onTimeoutRef.current?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const percent = (timeLeft / seconds) * 100;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const getColor = () => {
    if (timeLeft <= 10) return "#EF4444";
    if (timeLeft <= Math.floor(seconds * 0.3)) return "#F59E0B";
    return "#22C55E";
  };

  const formatTime = (s) => {
    if (s >= 60) {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec.toString().padStart(2, "0")}`;
    }
    return `${s}s`;
  };

  const color = getColor();

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" className="-rotate-90">
        {/* Background circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          strokeWidth="4"
          fill="none"
          stroke="var(--color-border)"
        />
        {/* Progress circle */}
        <Motion.circle
          cx="32"
          cy="32"
          r={radius}
          strokeWidth="4"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "linear" }}
          style={{ stroke: color }}
        />
      </svg>

      {/* Time text */}
      <Motion.span animate={{ color }} className="absolute text-xs font-bold">
        {formatTime(timeLeft)}
      </Motion.span>

      {/* Pulse when < 10s */}
      {timeLeft <= 10 && timeLeft > 0 && (
        <Motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${color}` }}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default CountdownTimer;
