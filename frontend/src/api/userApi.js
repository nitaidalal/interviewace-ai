import axiosInstance from "./axiosInstance.js";

export const getProfile = () => axiosInstance.get("/users/profile");

export const updateProfile = (data) =>
  axiosInstance.put("/users/profile", data);

export const uploadAvatar = (formData) =>
  axiosInstance.post("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const removeAvatar = () => axiosInstance.delete("/users/avatar");

export const getCredits = () => axiosInstance.get("/users/credits");
