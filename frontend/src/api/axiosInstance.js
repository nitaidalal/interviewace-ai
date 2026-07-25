import axios from "axios";
import { store } from "../redux/store.js";
import { clearUser } from "../redux/slices/authSlice.js";
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearUser());
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
