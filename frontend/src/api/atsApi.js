import axiosInstance from './axiosInstance.js'

export const analyzeResume = (formData) =>
  axiosInstance.post('/ats/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getATSHistory = (page = 1, limit = 10) =>
  axiosInstance.get(`/ats/history?page=${page}&limit=${limit}`)

export const getATSById = (id) =>
  axiosInstance.get(`/ats/${id}`)