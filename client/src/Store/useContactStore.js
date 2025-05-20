import { create } from "zustand";
import { axiosInstance } from "./axios";

export const useContactStore = create((set) => ({
  sendEmailToAdmin: async (mailData) => {
    try {
      const res = await axiosInstance.post("/contact-admin", mailData);

      return res.data;
    } catch (error) {
      throw Error(error?.response?.data?.message || "Error sending email!");
    }
  },
}));
