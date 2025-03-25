import { create } from "zustand";
import { axiosInstance } from "./axios";

// Store
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set) => ({
  profile: null,

  getProfile: async () => {
    try {
      let res = await axiosInstance.get("/user/profile");

      set({ profile: res.data.data });
    } catch (error) {
      console.log(error);
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  uploadProfilePic: async (profilePic) => {
    try {
      const res = await axiosInstance.patch("/user/profile-pic", profilePic);

      useAuthStore.getState().setUser(res.data.data);

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  uploadResume: async (resume) => {
    try {
      const res = await axiosInstance.patch("/user/resume", resume);

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },
}));
