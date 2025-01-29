import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CON);

    console.log("MongoDB connected Successfully!");
  } catch (error) {
    console.log("MongoDB connection error");
  }
};
