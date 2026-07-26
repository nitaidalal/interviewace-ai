import { motion as Motion } from "framer-motion";
import Badge from "../../components/ui/Badge.jsx";
import { HiSparkles } from "react-icons/hi2";

const ProfileHeader = ({ user }) => {
  const isPro = user?.subscription?.plan === "pro";

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 p-6 rounded-2xl"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-avatar-gradient flex items-center justify-center">
            <span className="text-xl font-bold text-white">{initials}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2
            className="text-xl font-semibold truncate"
            style={{ color: "var(--color-text-primary)" }}
          >
            {user?.name}
          </h2>
          <Badge variant={isPro ? "warning" : "muted"}>
            {isPro ? (
              <span className="flex items-center gap-1">
                <HiSparkles size={10} /> Pro
              </span>
            ) : (
              "Free"
            )}
          </Badge>
        </div>
        <p
          className="text-sm mt-0.5 truncate"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {user?.email}
        </p>
        {user?.education && (
          <p
            className="text-xs mt-1 truncate"
            style={{ color: "var(--color-text-muted)" }}
          >
            {user.education}
          </p>
        )}
      </div>
    </Motion.div>
  );
};

export default ProfileHeader;
