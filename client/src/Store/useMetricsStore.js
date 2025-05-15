import { create } from "zustand";
import { axiosInstance } from "./axios";

export const useMetricsStore = create((set) => ({
  adminMetrics: null,

  getAdminMetrics: async () => {
    try {
      let res = await axiosInstance.get("/admin-metrics");

      set({ adminMetrics: res.data.data });
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },
}));
