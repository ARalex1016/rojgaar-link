import { create } from "zustand";
import { axiosInstance } from "./axios";

export const useApplicationStore = create((set) => ({
  shortListApplication: async (jobId, applicationId) => {
    try {
      const res = await axiosInstance.patch(
        `/application/${jobId}/${applicationId}/shortlist`
      );

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  hireApplication: async (jobId, applicationId) => {
    try {
      const res = await axiosInstance.delete(
        `/application/${jobId}/${applicationId}/hire`
      );

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },
}));
