import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler.js";
import { ENV } from "../config/env.js";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("No token provided. Please login.", 401);
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new AppError("Invalid toke format. Use: Bearer <token>", 401);
  }

  const token = parts[1];
  const secret = ENV.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  const decode = jwt.verify(token, secret) as { userId: string };

  req.userId = decode.userId;

  next();
};
