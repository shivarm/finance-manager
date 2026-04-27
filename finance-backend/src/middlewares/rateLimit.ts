import { rateLimit } from "express-rate-limit";

export const apiLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: "Too many requests, please try again later.",
});
