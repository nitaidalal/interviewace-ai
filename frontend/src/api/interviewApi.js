import axiosInstance from "./axiosInstance.js";

export const startInterview = (data) =>
  axiosInstance.post("/interviews/start", data);

export const submitAnswer = (sessionId, data) =>
  axiosInstance.post(`/interviews/${sessionId}/message`, data);

export const endInterview = (sessionId) =>
  axiosInstance.post(`/interviews/${sessionId}/end`);

export const abandonInterview = (sessionId) =>
  axiosInstance.post(`/interviews/${sessionId}/abandon`);

export const getSession = (sessionId) =>
  axiosInstance.get(`/interviews/${sessionId}`);

export const getHistory = (page = 1, limit = 10) =>
  axiosInstance.get(`/interviews/history?page=${page}&limit=${limit}`);
