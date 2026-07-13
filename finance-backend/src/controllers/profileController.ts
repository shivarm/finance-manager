import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/asyncHandler.js";
import { AppError } from "../middlewares/errorHandler.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import path from "node:path";
import fs from "node:fs/promises";
import Finance from "../models/finance.model.js";

export const getProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const userObject = user.toObject();

  const { password: _, ...userWithoutPassword } = userObject;

  sendSuccess(res, userWithoutPassword, "Profile retrieved successfully");
});

export const getAvatar = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.avatar) {
    throw new AppError("No avatar found for this user", 404);
  }

  const avatarPath = path.join("uploads", "avatars", user.avatar);

  try {
    await fs.access(avatarPath);
  } catch {
    throw new AppError("Avatar file not found", 404);
  }

  res.sendFile(path.resolve(avatarPath));
});

export const uploadAvatar = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    if (!req.file) {
      throw new AppError("Please upload an file", 400);
    }

    const filename = req.file!.filename;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.avatar) {
      const oldAvatarPath = path.join("upload", "avatars", user.avatar);

      try {
        await fs.unlink(oldAvatarPath);
      } catch (error: any) {
        if (error.code !== "ENOENT") {
          throw new AppError("Failed to delete old avatar", 500);
        }
      }
    }
  },
);

export const deleteAvatar = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const user = await User.findById({ _id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.avatar) {
      throw new AppError("No avatar found for this user", 404);
    }

    try {
      const avatarPath = path.join("upload", "avatars", user.avatar);
      await fs.unlink(avatarPath);
    } catch (error: any) {
      // Ignore if the file doesn't exist
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    user.avatar = undefined;

    await user.save();

    sendSuccess(res, null, "Avatar deleted successfully");
  },
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!name && !email && !password) {
      throw new AppError("please provide name, email or password to update", 400);
    }

    if (name && name.trim().length < 2) {
      throw new AppError("Name must be at least 2 characters.", 400);
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

    if (email && email !== user.email) {
      const emailExist = await User.findOne({
        email: email,
        _id: { $ne: userId },
      });

      if (emailExist) {
        throw new AppError("Email already in use!", 400);
      }
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    const updateUser = await user.save();

    const userObject = updateUser.toObject();

    const { password: _, ...userWithoutPassword } = userObject;

    sendSuccess(res, userWithoutPassword, "Profile updated successfully!");
  },
);

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await Finance.deleteMany({ userId });

    if (user.avatar) {
      const avatarPath = path.join("upload", "avatars", user.avatar);

      try {
        await fs.unlink(avatarPath);
      } catch (error: any) {
        if (error.code !== "ENOENT") {
          throw new AppError("Failed to delete old avatar", 500);
        }
      }
    }

    await User.findByIdAndDelete(userId);

    sendSuccess(res, null, "Account deleted successfully> All data has been removed");
  },
);

export const exportData = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  const user = await User.findById({ _id: userId });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const expenses = await Finance.find({ userId });

  const userObject = user.toObject();

  const { password: _, ...userWithoutPassword } = userObject;

  if (expenses.length === 0) {
    return sendSuccess(
      res,
      {
        user: userWithoutPassword,
        expenses: [],
        summary: {
          totalExpense: 0,
          expenseCount: 0,
        },
        exportedAt: new Date().toISOString(),
      },
      "Data exported successfully. You have no expense!",
    );
  }
  // total expense
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const exportDataObject = {
    user: userWithoutPassword,
    expenses,
    summary: {
      totalExpense: Math.round(totalExpense * 100) / 100,
      expenseCount: expenses.length,
    },
    exportedAt: new Date().toISOString(),
  };
  sendSuccess(res, exportDataObject, "Data exported successfully.");
});
