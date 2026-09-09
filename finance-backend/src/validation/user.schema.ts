import { z } from "zod";

export const registerSchema = z.object({
  name: z.string(),
  email: z.email().min(1, "email is required"),
  password: z.string().min(8, "password is required"),
});

export const loginSchema = z.object({
  email: z.email().min(1, "email is required"),
  password: z.string().min(8, "password is required"),
});
