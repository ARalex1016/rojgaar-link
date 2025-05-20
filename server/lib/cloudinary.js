import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINATY_CLOUD_NAME,
  api_key: process.env.CLOUDINATY_API_KEY,
  api_secret: process.env.CLOUDINATY_API_SECRET,
});

export default cloudinary;
