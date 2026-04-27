import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { AppError } from "../middlewares/errorHandler.js";
import { asyncHandler, sendSuccess } from "../utils/asyncHandler.js";
import { AuthResponse } from "../types/index.js";

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  if (name && name.trim().length > 20) {
    throw new AppError("Name can not exceed 20 characters", 400);
  }
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Invalid email format", 400);
    }
  }

  if (password) {
    if (password.length < 8) {
      throw new AppError("Password must be at least 8 characters.", 400);
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!passwordRegex.test(password)) {
      throw new AppError(
        "Password must contain uppercase, lowercase, number, and special character (@$!%*?&)",
        400,
      );
    }
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();

  const userObject = savedUser.toObject();

  const { password: _, ...userWithoutPassword } = userObject;

  const authResponse: AuthResponse = {
    user: { ...userWithoutPassword, _id: savedUser._id.toString() },
  };

  sendSuccess(res, authResponse, "Account created successfully!", 201);
});
