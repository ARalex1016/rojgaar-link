import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1"
      : "/api/v1",
  withCredentials: true,
});

// Dynamically add the Authorization header in development mode
if (import.meta.env.MODE === "development") {
  axiosInstance.interceptors.request.use(
    (config) => {
      // Dynamically get the token from localStorage before each request
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
