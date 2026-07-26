import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { MdOutlineSave } from "react-icons/md";
import { FiUser, FiBook } from "react-icons/fi";
import { RiStackLine } from "react-icons/ri";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import AvatarUpload from "./AvatarUpload.jsx";
import { PREFERRED_STACKS, EXPERIENCE_LEVELS } from "../../utils/constants.js";

const mapYearsToLevel = (years) => {
  if (years <= 0 ) return EXPERIENCE_LEVELS[0];
  return (
    EXPERIENCE_LEVELS.find((e) => years >= e.minYears && years <= e.maxYears) ||
    EXPERIENCE_LEVELS[EXPERIENCE_LEVELS.length - 1]
  );
  
};

const ProfileForm = ({
  profile,
  saving,
  uploading,
  onSave,
  onUpload,
  onRemove,
}) => {
  const [form, setForm] = useState({
    name: "",
    education: "",
    experienceYears: 0,
    preferredLanguage: "English",
    preferredStack: [],
  });

  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[0]);

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name || "",
      education: profile.education || "",
      experienceYears: profile.experience?.years || 0,
      preferredLanguage: profile.preferredLanguage || "English",
      preferredStack: profile.preferredStack || [],
    });
    setExperienceLevel(mapYearsToLevel(profile.experience?.years || 0));
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "experienceYears") {
      const years = parseInt(value) || 0;
      setExperienceLevel(mapYearsToLevel(years));
    }
  };

  const toggleStack = (stack) => {
    setForm((prev) => ({
      ...prev,
      preferredStack: prev.preferredStack.includes(stack)
        ? prev.preferredStack.filter((s) => s !== stack)
        : [...prev.preferredStack, stack],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: form.name,
      education: form.education,
      experience: {
        years: parseInt(form.experienceYears) || 0,
        level: experienceLevel.value,
      },
      preferredLanguage: form.preferredLanguage,
      preferredStack: form.preferredStack,
    });
  };

  return (
    <Motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl flex flex-col gap-6"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h3
        className="text-base font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        Edit Profile
      </h3>

      {/* Avatar Upload */}
      <AvatarUpload
        user={profile}
        uploading={uploading}
        onUpload={onUpload}
        onRemove={onRemove}
      />

      <div
        className="h-px"
        style={{ backgroundColor: "var(--color-border)" }}
      />

      {/* Name & Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          leftIcon={<FiUser size={15} />}
          required
          disabled={saving}
        />
        <Input
          label="Education"
          name="education"
          value={form.education}
          onChange={handleChange}
          placeholder="B.Tech Computer Science"
          leftIcon={<FiBook size={15} />}
          disabled={saving}
        />
      </div>

      {/* Experience */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Years of Experience
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            name="experienceYears"
            value={form.experienceYears}
            onChange={handleChange}
            min={0}
            max={50}
            disabled={saving}
            className="input-base w-28"
            placeholder="0"
          />
          <Motion.span
            key={experienceLevel.value}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 15%, transparent)",
              color: "var(--color-primary)",
            }}
          >
            {experienceLevel.label}
          </Motion.span>
        </div>
      </div>

      {/* Preferred Language */}
      <Input
        label="Preferred Language"
        name="preferredLanguage"
        value={form.preferredLanguage}
        onChange={handleChange}
        placeholder="English"
        disabled={saving}
      />

      {/* Preferred Stack */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium flex items-center gap-1.5"
          style={{ color: "var(--color-text-primary)" }}
        >
          <RiStackLine size={15} />
          Preferred Stack
          <span
            style={{ color: "var(--color-text-muted)" }}
            className="font-normal"
          >
            (select all that apply)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PREFERRED_STACKS.map((stack) => {
            const selected = form.preferredStack.includes(stack);
            return (
              <Motion.button
                key={stack}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleStack(stack)}
                disabled={saving}
                className="px-3 py-1 rounded-full text-xs font-medium
                  border transition-all duration-200 cursor-pointer
                  disabled:opacity-50"
                style={{
                  backgroundColor: selected
                    ? "color-mix(in srgb, var(--color-primary) 15%, transparent)"
                    : "transparent",
                  borderColor: selected
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                  color: selected
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                }}
              >
                {stack}
              </Motion.button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={saving} className="gap-2">
          <MdOutlineSave size={16} />
          Save Changes
        </Button>
      </div>
    </Motion.form>
  );
};

export default ProfileForm;
