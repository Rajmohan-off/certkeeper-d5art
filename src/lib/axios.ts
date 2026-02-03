import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + '/api/v1',
  withCredentials: true,
});

// Using cookies, so we don't need to manually inject tokens from localStorage
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If we get a 401, it means the token might be expired.
    // The browser will automatically send the refresh cookie if configured correctly in the backend.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post('/auth/refresh-token');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Redirection should be handled in the UI/Redux layer
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
