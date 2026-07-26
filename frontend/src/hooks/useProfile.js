import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setUser } from "../redux/slices/authSlice.js";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  getCredits,
} from "../api/userApi.js";
import { parseApiError } from "../utils/errorParser.js";

const useProfile = () => {
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await getProfile();
      setProfile(res.data.data.user);
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchCredits = async () => {
    setLoadingCredits(true);
    try {
      const res = await getCredits();
      setCredits(res.data.data.credits);
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setLoadingCredits(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCredits();
  }, []);

  const handleUpdateProfile = async (data) => {
    setSaving(true);
    try {
      const res = await updateProfile(data);
      const updated = res.data.data.user;
      setProfile(updated);
      dispatch(setUser(updated));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUploadAvatar = async (file) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await uploadAvatar(formData);
      const updated = res.data.data.user;
      setProfile(updated);
      dispatch(setUser(updated));
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    try {
      const res = await removeAvatar();
      const updated = res.data.data.user;
      setProfile(updated);
      dispatch(setUser(updated));
      toast.success("Avatar removed");
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setUploadingAvatar(false);
    }
  };

  return {
    profile,
    credits,
    loadingProfile,
    loadingCredits,
    saving,
    uploadingAvatar,
    handleUpdateProfile,
    handleUploadAvatar,
    handleRemoveAvatar,
    fetchProfile,
    fetchCredits,
  };
};

export default useProfile;
