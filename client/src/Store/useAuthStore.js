import { create } from "zustand";
import { axiosInstance } from "./axios";

// Only In Development
const setTokenInDev = (token) => {
  if (import.meta.env.MODE === "development") {
    if (token) {
      localStorage.setItem("token", String(token));
    }
  }
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isCreator: false,
  isCandidate: false,
  isSigningIn: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isCheckingAuth: false,
  isLoading: false,

  setUser: async (newUser) => {
    set({
      user: newUser,
      isAuthenticated: true,
      isAdmin: newUser.role === "admin",
      isCreator: newUser.role === "creator",
      isCandidate: newUser.role === "candidate",
    });
  },

  setLoader: async (state) => {
    set({
      isLoading: state,
    });
  },

  signup: async (userData) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/signup", userData);

      set({
        user: res.data.data,
        isAuthenticated: true,
        isAdmin: res.data.data.role === "admin",
        isCreator: res.data.data.role === "creator",
        isCandidate: res.data.data.role === "candidate",
      });

      setTokenInDev(res.data.token);

      return res.data.message;
    } catch (error) {
      set({
        isAuthenticated: false,
      });

      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      set({ isSigningIn: false });
    }
  },

  login: async (userData) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", userData);

      set({
        user: res.data.data,
        isAuthenticated: true,
        isAdmin: res.data.data.role === "admin",
        isCreator: res.data.data.role === "creator",
        isCandidate: res.data.data.role === "candidate",
      });

      setTokenInDev(res.data.token);

      return res.data.message;
    } catch (error) {
      set({
        isAuthenticated: false,
      });

      throw new Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.post("/auth/check-auth");

      set({
        user: res.data.data,
        isAuthenticated: true,
        isAdmin: res.data.data.role === "admin",
        isCreator: res.data.data.role === "creator",
        isCandidate: res.data.data.role === "candidate",
      });
    } catch (error) {
      set({ isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true, isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/logout");

      if (import.meta.env.MODE === "development") {
        localStorage.removeItem("token");
      }

      //   Success
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      set({
        error: error.response.data.message,
      });
      throw Error;
    } finally {
      set({ isLoggingOut: false, isLoading: false });
    }
  },

  sendEmailWithOTP: async () => {
    try {
      const res = await axiosInstance.post("/auth/send-email-with-otp");

      return res.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  verifyEmail: async (code) => {
    try {
      const res = await axiosInstance.post("/auth/verify-email", { code });

      set({
        user: res.data.data,
      });

      return res.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },
}));
