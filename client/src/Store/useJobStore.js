import { create } from "zustand";
import { axiosInstance } from "./axios";

// Store
import { useAuthStore } from "./useAuthStore";

export const useJobStore = create((set) => ({
  jobs: null,
  categories: null,
  counters: null,

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

  // Get Job By Status
  getAllJobs: async (status, pageQuery) => {
    try {
      const url = `/jobs/?status=${status}${pageQuery}`;

      const res = await axiosInstance.get(url);

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  getAllActiveJobs: async (queryString) => {
    useAuthStore.getState().setLoader(true);

    try {
      const url = queryString ? `/jobs/active?${queryString}` : `/jobs/active`;

      const res = await axiosInstance.get(url);

      set({ jobs: res.data });

      return res.data.message;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      useAuthStore.getState().setLoader(false);
    }
  },

  getJobById: async (jobId) => {
    useAuthStore.getState().setLoader(true);

    try {
      const res = await axiosInstance.get(`/jobs/${jobId}`);

      return res.data.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      useAuthStore.getState().setLoader(false);
    }
  },

  getAllAppliedCandidates: async (jobId, page) => {
    useAuthStore.getState().setLoader(true);

    try {
      const res = await axiosInstance.get(
        `/jobs/${jobId}/applied-candidates?page=${page}`
      );

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      useAuthStore.getState().setLoader(false);
    }
  },

  getAppliedCandidateById: async (jobId, userId) => {
    try {
      const res = await axiosInstance.get(`/jobs/${jobId}/${userId}`);

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  getCounters: async () => {
    try {
      const res = await axiosInstance.get("/jobs/counters");

      set({ counters: res.data.data });

      return;
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

  removeJob: async (jobId) => {
    try {
      const res = await axiosInstance.post(`/jobs/${jobId}/remove`);

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

  // For My Jobs (for different end points)
  customRequest: async (apiEndpoint, pageQuery) => {
    useAuthStore.getState().setLoader(true);
    try {
      const url = `${apiEndpoint}&${pageQuery}`;
      const res = await axiosInstance.get(url);

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      useAuthStore.getState().setLoader(false);
    }
  },

  createJob: async (jobData) => {
    try {
      const res = await axiosInstance.post(`/jobs/create`, jobData);

      return res.data;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  approveJob: async (jobId) => {
    try {
      const res = await axiosInstance.patch(`/jobs/${jobId}/approve`);

      return res.data.message;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  suspendJob: async (jobId) => {
    try {
      const res = await axiosInstance.patch(`/jobs/${jobId}/suspend`);

      return res.data.message;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },

  deleteJob: async (jobId) => {
    try {
      const res = await axiosInstance.delete(`/jobs/${jobId}`);

      return res.data.message;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },
}));
