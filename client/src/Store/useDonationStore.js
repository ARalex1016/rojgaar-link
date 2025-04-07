import { create } from "zustand";
import { axiosInstance } from "./axios";

export const useDonationStore = create((set) => ({
  createDonationIntent: async (formData) => {
    try {
      const res = await axiosInstance.post(
        "/donation/create-payment-intent",
        formData
      );

      return res;
    } catch (error) {
      throw Error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    }
  },
}));
