import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateToken = (userId: string): string => {
  const secret = ENV.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload = { userId };

  const token = jwt.sign(payload, secret, { expiresIn: "7d" });

  return token;
};