import { create } from "zustand";
import { axiosInstance } from "./axios";

export const useJobStore = create((set) => ({
  jobs: null,
  categories: null,

  getCategories: async () => {
    try {
      const res = await axiosInstance.get("/jobs/categories");

      set({ categories: res.data.data });

      return res.data.message;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  getAllActiveJobs: async (queryString) => {
    try {
      const url = queryString ? `/jobs/active?${queryString}` : `/jobs/active`;

      const res = await axiosInstance.get(url);

      set({ jobs: res.data.data });

      return res.data.message;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  getJobById: async (jobId) => {
    try {
      const res = await axiosInstance.get(`/jobs/${jobId}`);

      return res.data.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  saveJob: async (jobId) => {
    try {
      const res = await axiosInstance.post(`/jobs/${jobId}/save`);

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  applyJob: async (jobId) => {
    try {
      const res = await axiosInstance.post(`/application/${jobId}/apply`);

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  customRequest: async (apiEndpoint) => {
    // console.log(apiEndpoint);

    try {
      const res = await axiosInstance.get(apiEndpoint);

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },
}));
