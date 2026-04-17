import axios from "axios";
import { store } from "../store/Store";
import { logout } from "../store/slices/AuthSlice";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized handling
    if (error.response?.status === 401) {
      const currentUrl = error.config?.url;
      
      // Don't logout if the user is already trying to login
      if (currentUrl && !currentUrl.includes("/api/v1/user/login")) {
        store.dispatch(logout());
        // Note: App.jsx handles redirection based on state
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
