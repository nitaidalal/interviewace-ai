import { motion as Motion } from "framer-motion";
import ProfileHeader from "../features/profile/ProfileHeader.jsx";
import ProfileForm from "../features/profile/ProfileForm.jsx";
import CreditsWidget from "../features/profile/CreditsWidget.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import useProfile from "../hooks/useProfile.js";

const ProfilePage = () => {
  const {
    profile,
    credits,
    loadingProfile,
    loadingCredits,
    saving,
    uploadingAvatar,
    handleUpdateProfile,
    handleUploadAvatar,
    handleRemoveAvatar,
  } = useProfile();

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Page title */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Profile
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Manage your account and preferences
        </p>
      </div>

      {/* Header card */}
      <ProfileHeader user={profile} />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile form — takes 2 cols */}
        <div className="lg:col-span-2">
          <ProfileForm
            profile={profile}
            saving={saving}
            uploading={uploadingAvatar}
            onSave={handleUpdateProfile}
            onUpload={handleUploadAvatar}
            onRemove={handleRemoveAvatar}
          />
        </div>

        {/* Credits widget — 1 col */}
        <div>
          <CreditsWidget credits={credits} loading={loadingCredits} />
        </div>
      </div>
    </Motion.div>
  );
};

export default ProfilePage;
