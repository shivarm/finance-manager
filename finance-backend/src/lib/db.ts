import mongoose from "mongoose";
import { ENV } from "../config/env.js";

export const connectDB = async () => {
  try {
    if (!ENV.DATABASE_URL) {
      throw new Error("DB_URL is not defined in environment variables");
    }
    const conn = await mongoose.connect(ENV.DATABASE_URL);
    console.log("Connected to MongoDB:", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1); // 0 -> success, 1 -> failure
  }
};
