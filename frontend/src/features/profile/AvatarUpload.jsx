import { useRef } from "react";
import { motion as Motion } from "framer-motion";
import { MdOutlineCameraAlt, MdOutlineDelete } from "react-icons/md";
import Spinner from "../../components/ui/Spinner.jsx";

const AvatarUpload = ({ user, uploading, onUpload, onRemove }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onUpload(file);
    e.target.value = "";
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-6">
      {/* Avatar */}
      <div className="relative group">
        <Motion.div
          whileHover={{ scale: 1.03 }}
          className="w-24 h-24 rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => !uploading && inputRef.current?.click()}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-avatar-gradient flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
          )}

          {/* Overlay */}
          {uploading ? (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <Spinner size="sm" />
            </div>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
              <MdOutlineCameraAlt size={24} className="text-white" />
            </div>
          )}
        </Motion.div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-sm font-medium transition-colors
            duration-200 cursor-pointer disabled:opacity-50"
          style={{ color: "var(--color-primary)" }}
        >
          <MdOutlineCameraAlt size={16} />
          {user?.avatar ? "Change Photo" : "Upload Photo"}
        </button>

        {user?.avatar && (
          <button
            onClick={onRemove}
            disabled={uploading}
            className="flex items-center gap-2 text-sm transition-colors
              duration-200 cursor-pointer disabled:opacity-50"
            style={{ color: "var(--color-danger)" }}
          >
            <MdOutlineDelete size={16} />
            Remove Photo
          </button>
        )}

        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          JPEG, PNG or WebP · Max 2MB
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;
