import axiosInstance from "./axiosInstance.js";

export const transcribeAudio = (formData) =>
  axiosInstance.post("/speech/transcribe", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
